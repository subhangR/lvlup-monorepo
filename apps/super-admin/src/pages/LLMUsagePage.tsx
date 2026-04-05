import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { getFirebaseServices } from "@levelup/shared-services";
import type { Tenant, DailyCostSummary } from "@levelup/shared-types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  StatCard,
  PageHeader,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Progress,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  DataTablePagination,
} from "@levelup/shared-ui";
import {
  DollarSign,
  Zap,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { usePagination } from "../hooks/usePagination";

function getMonthRange(offset: number) {
  const now = new Date();
  now.setMonth(now.getMonth() + offset);
  const year = now.getFullYear();
  const month = now.getMonth();
  const label = `${year}-${String(month + 1).padStart(2, "0")}`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  return {
    label,
    displayLabel: new Date(year, month).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    start: `${label}-01`,
    end: `${label}-${String(lastDay).padStart(2, "0")}`,
  };
}

interface TenantCostData {
  tenantId: string;
  tenantName: string;
  tenantCode: string;
  status: string;
  totalCost: number;
  totalCalls: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  budgetLimitUsd?: number;
  budgetUsedPercent?: number;
}

function usePlatformLLMUsage(monthOffset: number) {
  const range = getMonthRange(monthOffset);

  return useQuery({
    queryKey: ["platform", "llmUsage", range.label],
    queryFn: async () => {
      const { db } = getFirebaseServices();

      const tenantsSnap = await getDocs(collection(db, "tenants"));
      const tenants = tenantsSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Tenant);

      const tenantCostResults = await Promise.all(
        tenants.map(async (tenant) => {
          const colRef = collection(db, `tenants/${tenant.id}/dailyCostSummaries`);
          const q = query(
            colRef,
            where("date", ">=", range.start),
            where("date", "<=", range.end),
            orderBy("date", "desc")
          );
          const snap = await getDocs(q);
          const days = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as DailyCostSummary);
          return { tenant, days };
        })
      );

      const tenantCosts: TenantCostData[] = [];
      const allDailyCosts: DailyCostSummary[] = [];
      const byPurposeAgg: Record<string, { calls: number; costUsd: number }> = {};

      for (const { tenant, days } of tenantCostResults) {
        const totalCost = days.reduce((s, d) => s + d.totalCostUsd, 0);
        const totalCalls = days.reduce((s, d) => s + d.totalCalls, 0);
        const totalInputTokens = days.reduce((s, d) => s + d.totalInputTokens, 0);
        const totalOutputTokens = days.reduce((s, d) => s + d.totalOutputTokens, 0);

        for (const day of days) {
          if (day.byPurpose) {
            for (const [purpose, data] of Object.entries(day.byPurpose)) {
              if (!byPurposeAgg[purpose]) {
                byPurposeAgg[purpose] = { calls: 0, costUsd: 0 };
              }
              byPurposeAgg[purpose].calls += data.calls;
              byPurposeAgg[purpose].costUsd += data.costUsd;
            }
          }
        }

        allDailyCosts.push(...days);

        if (totalCost > 0 || totalCalls > 0) {
          const budgetLimit = days[0]?.budgetLimitUsd;
          tenantCosts.push({
            tenantId: tenant.id,
            tenantName: tenant.name,
            tenantCode: tenant.tenantCode,
            status: tenant.status,
            totalCost,
            totalCalls,
            totalInputTokens,
            totalOutputTokens,
            budgetLimitUsd: budgetLimit,
            budgetUsedPercent: budgetLimit
              ? Math.round((totalCost / budgetLimit) * 100)
              : undefined,
          });
        }
      }

      tenantCosts.sort((a, b) => b.totalCost - a.totalCost);

      const dailyMap = new Map<string, { date: string; cost: number; calls: number }>();
      for (const d of allDailyCosts) {
        const existing = dailyMap.get(d.date);
        if (existing) {
          existing.cost += d.totalCostUsd;
          existing.calls += d.totalCalls;
        } else {
          dailyMap.set(d.date, { date: d.date, cost: d.totalCostUsd, calls: d.totalCalls });
        }
      }
      const dailyTrend = Array.from(dailyMap.values())
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((d) => ({
          ...d,
          label: d.date.slice(5),
          cost: Math.round(d.cost * 100) / 100,
        }));

      const platformTotalCost = tenantCosts.reduce((s, t) => s + t.totalCost, 0);
      const platformTotalCalls = tenantCosts.reduce((s, t) => s + t.totalCalls, 0);
      const platformTotalInput = tenantCosts.reduce((s, t) => s + t.totalInputTokens, 0);
      const platformTotalOutput = tenantCosts.reduce((s, t) => s + t.totalOutputTokens, 0);

      const byPurpose = Object.entries(byPurposeAgg)
        .map(([name, data]) => ({ name, ...data, costUsd: Math.round(data.costUsd * 100) / 100 }))
        .sort((a, b) => b.costUsd - a.costUsd);

      return {
        month: range.label,
        platformTotalCost,
        platformTotalCalls,
        platformTotalInput,
        platformTotalOutput,
        tenantCosts,
        dailyTrend,
        byPurpose,
        activeTenants: tenantCosts.length,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export default function LLMUsagePage() {
  const [monthOffset, setMonthOffset] = useState(0);
  const { data, isLoading, isError, error, refetch } = usePlatformLLMUsage(monthOffset);
  const range = getMonthRange(monthOffset);

  const tenantList = useMemo(() => data?.tenantCosts ?? [], [data]);
  const { paginatedItems, currentPage, pageSize, totalItems, setCurrentPage, setPageSize } =
    usePagination(tenantList);

  return (
    <div className="space-y-6">
      <PageHeader
        title="LLM Usage & Costs"
        description="Platform-wide AI usage, costs, and per-tenant quota tracking"
      />

      {/* Month Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setMonthOffset((o) => o - 1)}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="bg-card flex min-w-[160px] items-center justify-center gap-2 rounded-lg border px-3 py-1.5">
          <Calendar className="text-muted-foreground h-3.5 w-3.5" />
          <span className="text-sm font-medium">{range.displayLabel}</span>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={monthOffset >= 0}
          onClick={() => setMonthOffset((o) => o + 1)}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load LLM usage data</AlertTitle>
          <AlertDescription className="flex items-center gap-2">
            {error instanceof Error ? error.message : "An unexpected error occurred."}
            <Button variant="link" className="h-auto p-0" onClick={() => refetch()}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="space-y-2 px-4 pb-4 pt-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="mb-4 h-5 w-32" />
              <Skeleton className="h-[200px] w-full rounded-md" />
            </CardContent>
          </Card>
        </div>
      ) : data ? (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Monthly Cost"
              value={`$${data.platformTotalCost.toFixed(2)}`}
              icon={DollarSign}
              subtext={`${data.activeTenants} tenants with usage`}
            />
            <StatCard
              label="Total API Calls"
              value={data.platformTotalCalls.toLocaleString()}
              icon={Zap}
              subtext="across all tenants"
            />
            <StatCard
              label="Input Tokens"
              value={data.platformTotalInput.toLocaleString()}
              icon={ArrowUpDown}
              subtext="total input tokens"
            />
            <StatCard
              label="Output Tokens"
              value={data.platformTotalOutput.toLocaleString()}
              icon={ArrowUpDown}
              subtext="total output tokens"
            />
          </div>

          {/* Daily Cost Trend */}
          {data.dailyTrend.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Daily Cost Trend</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    data={data.dailyTrend}
                    margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="label"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                      tickFormatter={(v: number) => `$${v}`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value: number) => [`$${value.toFixed(2)}`, "Cost"]}
                      cursor={{ fill: "hsl(var(--muted))", radius: 4 }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--card-foreground))",
                      }}
                      labelStyle={{ color: "hsl(var(--card-foreground))" }}
                      itemStyle={{ color: "hsl(var(--card-foreground))" }}
                    />
                    <Bar
                      dataKey="cost"
                      fill="hsl(var(--primary))"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={48}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Cost by Purpose */}
          {data.byPurpose.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Cost by Task Type</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {data.byPurpose.map((p) => {
                    const pct =
                      data.platformTotalCost > 0
                        ? Math.round((p.costUsd / data.platformTotalCost) * 100)
                        : 0;
                    return (
                      <div key={p.name} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium capitalize">{p.name}</span>
                          <span className="text-muted-foreground tabular-nums">
                            ${p.costUsd.toFixed(2)} ({pct}%) &middot; {p.calls.toLocaleString()}{" "}
                            calls
                          </span>
                        </div>
                        <Progress value={Math.min(pct, 100)} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Per-Tenant Breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <div>
                <CardTitle className="text-base">Per-Tenant Usage</CardTitle>
                <p className="text-muted-foreground mt-0.5 text-xs">Sorted by cost, descending</p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableCaption className="sr-only">LLM usage by tenant</TableCaption>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead>Tenant</TableHead>
                    <TableHead className="text-right">Calls</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                    <TableHead className="w-[160px]">Usage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-48">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
                            <Zap className="text-muted-foreground h-6 w-6" />
                          </div>
                          <h3 className="mt-3 text-sm font-semibold">No AI usage this month</h3>
                          <p className="text-muted-foreground mt-1 text-xs">
                            No tenants have recorded AI API calls for {range.displayLabel}.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedItems.map((t) => (
                      <TableRow key={t.tenantId}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{t.tenantName}</p>
                            <code className="text-muted-foreground font-mono text-xs">
                              {t.tenantCode}
                            </code>
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {t.totalCalls.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium tabular-nums">
                          ${t.totalCost.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {t.budgetLimitUsd ? `$${t.budgetLimitUsd.toFixed(2)}` : "--"}
                        </TableCell>
                        <TableCell>
                          {t.budgetUsedPercent !== undefined ? (
                            <div className="flex items-center gap-2">
                              <Progress
                                value={Math.min(t.budgetUsedPercent, 100)}
                                className={`h-2 flex-1 ${
                                  t.budgetUsedPercent >= 100
                                    ? "[&>div]:bg-destructive"
                                    : t.budgetUsedPercent >= 80
                                      ? "[&>div]:bg-amber-500"
                                      : ""
                                }`}
                              />
                              <span
                                className={`w-10 text-right text-xs font-medium tabular-nums ${
                                  t.budgetUsedPercent >= 100
                                    ? "text-destructive"
                                    : t.budgetUsedPercent >= 80
                                      ? "text-amber-600 dark:text-amber-400"
                                      : "text-muted-foreground"
                                }`}
                              >
                                {t.budgetUsedPercent}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">No budget</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <DataTablePagination
                totalItems={totalItems}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
            </CardContent>
          </Card>

          {/* Empty state for zero usage */}
          {data.tenantCosts.length === 0 && data.dailyTrend.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
                <DollarSign className="text-muted-foreground h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No AI usage data</h3>
              <p className="text-muted-foreground mt-1 max-w-sm text-sm">
                No tenants have recorded any AI API calls for {range.displayLabel}. Usage data is
                generated when tenants use AI grading, tutoring, or evaluation features.
              </p>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
