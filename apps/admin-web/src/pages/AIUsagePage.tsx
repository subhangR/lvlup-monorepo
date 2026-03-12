import { useMemo, useState, useEffect } from "react";
import { useCurrentTenantId } from "@levelup/shared-stores";
import { useDailyCostSummaries, useTenantSettings } from "@levelup/shared-hooks";
import {
  ScoreCard,
  SimpleBarChart,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  DataTablePagination,
} from "@levelup/shared-ui";
import {
  DollarSign,
  Zap,
  Activity,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Skull,
} from "lucide-react";
import { usePagination } from "../hooks/usePagination";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { getFirebaseServices } from "@levelup/shared-services";

function getMonthRange(monthOffset: number) {
  const d = new Date();
  d.setMonth(d.getMonth() + monthOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const lastDay = new Date(year, d.getMonth() + 1, 0).getDate();
  return {
    label: `${year}-${month}`,
    start: `${year}-${month}-01`,
    end: `${year}-${month}-${lastDay}`,
  };
}

export default function AIUsagePage() {
  const tenantId = useCurrentTenantId();
  const [monthOffset, setMonthOffset] = useState(0);
  const range = getMonthRange(monthOffset);

  const { data: dailyCosts = [], isLoading } = useDailyCostSummaries(
    tenantId,
    { start: range.start, end: range.end },
  );

  const { data: tenantSettings } = useTenantSettings(tenantId);

  // Dead letter queue (failed grading attempts)
  interface DLQEntry {
    id: string;
    submissionId: string;
    questionSubmissionId: string;
    pipelineStep: string;
    error: string;
    attempts: number;
    lastAttemptAt: { toDate?: () => Date } | null;
  }
  const [dlqEntries, setDlqEntries] = useState<DLQEntry[]>([]);
  const [dlqLoading, setDlqLoading] = useState(false);

  useEffect(() => {
    if (!tenantId) return;
    const fetchDLQ = async () => {
      setDlqLoading(true);
      try {
        const { db } = getFirebaseServices();
        const dlqQuery = query(
          collection(db, `tenants/${tenantId}/gradingDeadLetter`),
          orderBy("lastAttemptAt", "desc"),
          limit(50),
        );
        const snap = await getDocs(dlqQuery);
        setDlqEntries(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as DLQEntry));
      } catch {
        // Collection may not exist yet
        setDlqEntries([]);
      } finally {
        setDlqLoading(false);
      }
    };
    fetchDLQ();
  }, [tenantId]);
  const usageQuota = tenantSettings?.usageQuota as
    | { monthlyBudgetUsd: number; dailyCallLimit: number; warningThresholdPercent: number }
    | undefined;

  const monthlySummary = useMemo(() => {
    const totalCost = dailyCosts.reduce((s, d) => s + d.totalCostUsd, 0);
    const totalCalls = dailyCosts.reduce((s, d) => s + d.totalCalls, 0);
    const totalInput = dailyCosts.reduce(
      (s, d) => s + d.totalInputTokens,
      0,
    );
    const totalOutput = dailyCosts.reduce(
      (s, d) => s + d.totalOutputTokens,
      0,
    );

    // Aggregate by purpose
    const byPurpose: Record<string, { calls: number; costUsd: number }> = {};
    dailyCosts.forEach((day) => {
      Object.entries(day.byPurpose ?? {}).forEach(([purpose, data]) => {
        if (!byPurpose[purpose]) {
          byPurpose[purpose] = { calls: 0, costUsd: 0 };
        }
        byPurpose[purpose].calls += data.calls;
        byPurpose[purpose].costUsd += data.costUsd;
      });
    });

    return { totalCost, totalCalls, totalInput, totalOutput, byPurpose };
  }, [dailyCosts]);

  // Quota calculations
  const quotaPercent = usageQuota?.monthlyBudgetUsd
    ? Math.min(100, Math.round((monthlySummary.totalCost / usageQuota.monthlyBudgetUsd) * 100))
    : null;
  const isApproachingQuota = quotaPercent != null && quotaPercent >= (usageQuota?.warningThresholdPercent ?? 80);
  const isOverQuota = quotaPercent != null && quotaPercent >= 100;

  // Cost projection: estimate month-end cost based on current daily average
  const projectedCost = useMemo(() => {
    if (dailyCosts.length === 0 || monthOffset !== 0) return null;
    const avgDailyCost = monthlySummary.totalCost / dailyCosts.length;
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const projected = avgDailyCost * daysInMonth;
    return { avgDailyCost, projected, daysInMonth, daysElapsed: dailyCosts.length };
  }, [dailyCosts, monthlySummary.totalCost, monthOffset]);

  // Daily cost chart data (sorted by date ascending)
  const dailyChartData = [...dailyCosts]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => ({
      label: d.date.slice(5), // MM-DD
      value: d.totalCostUsd,
      color: "hsl(var(--primary))",
    }));

  // Purpose breakdown chart — use semantic CSS variable references
  const PURPOSE_COLORS: Record<string, string> = {
    extraction: "hsl(var(--chart-1))",
    grading: "hsl(var(--chart-2))",
    evaluation: "hsl(var(--chart-3))",
    tutoring: "hsl(var(--chart-4))",
  };

  const purposeChartData = Object.entries(monthlySummary.byPurpose)
    .sort((a, b) => b[1].costUsd - a[1].costUsd)
    .map(([purpose, data]) => ({
      label: purpose.replace(/_/g, " "),
      value: data.costUsd,
      color: PURPOSE_COLORS[purpose] ?? "hsl(var(--muted-foreground))",
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Usage & Costs</h1>
          <p className="text-sm text-muted-foreground">
            Monitor AI API usage and costs for your tenant
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setMonthOffset((o) => o - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium w-20 text-center">
            {range.label}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setMonthOffset((o) => Math.min(0, o + 1))}
            disabled={monthOffset >= 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ScoreCard
          label="Monthly Cost"
          value={`$${monthlySummary.totalCost.toFixed(2)}`}
          icon={DollarSign}
        />
        <ScoreCard
          label="Total Calls"
          value={monthlySummary.totalCalls.toLocaleString()}
          icon={Zap}
        />
        <ScoreCard
          label="Input Tokens"
          value={
            monthlySummary.totalInput > 1000000
              ? `${(monthlySummary.totalInput / 1000000).toFixed(1)}M`
              : `${Math.round(monthlySummary.totalInput / 1000)}K`
          }
          icon={Activity}
        />
        <ScoreCard
          label="Output Tokens"
          value={
            monthlySummary.totalOutput > 1000000
              ? `${(monthlySummary.totalOutput / 1000000).toFixed(1)}M`
              : `${Math.round(monthlySummary.totalOutput / 1000)}K`
          }
          icon={TrendingUp}
        />
      </div>

      {/* Quota Warning Banner */}
      {isOverQuota && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 p-4">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800 dark:text-red-300">
              Monthly AI quota exceeded
            </p>
            <p className="text-xs text-red-600 dark:text-red-400">
              Spending: ${monthlySummary.totalCost.toFixed(2)} / ${usageQuota?.monthlyBudgetUsd?.toFixed(2)}. AI grading is paused. Increase the quota in Settings.
            </p>
          </div>
        </div>
      )}
      {isApproachingQuota && !isOverQuota && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Approaching monthly AI quota
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              {quotaPercent}% used (${monthlySummary.totalCost.toFixed(2)} / ${usageQuota?.monthlyBudgetUsd?.toFixed(2)})
            </p>
          </div>
        </div>
      )}

      {/* Quota Progress Bar */}
      {usageQuota?.monthlyBudgetUsd != null && usageQuota.monthlyBudgetUsd > 0 && (
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Monthly Budget Usage</span>
            <span className="text-sm text-muted-foreground">
              ${monthlySummary.totalCost.toFixed(2)} / ${usageQuota.monthlyBudgetUsd.toFixed(2)}
            </span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isOverQuota
                  ? "bg-red-500"
                  : isApproachingQuota
                    ? "bg-amber-500"
                    : "bg-green-500"
              }`}
              style={{ width: `${Math.min(100, quotaPercent ?? 0)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {quotaPercent}% of monthly budget used
          </p>
        </div>
      )}

      {/* Cost Projection */}
      {projectedCost && (
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Month-End Projection</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Based on ${projectedCost.avgDailyCost.toFixed(2)}/day avg over {projectedCost.daysElapsed} days
              </p>
            </div>
            <div className="text-right">
              <p className={`text-xl font-bold ${
                usageQuota?.monthlyBudgetUsd && projectedCost.projected > usageQuota.monthlyBudgetUsd
                  ? 'text-destructive'
                  : 'text-foreground'
              }`}>
                ${projectedCost.projected.toFixed(2)}
              </p>
              {usageQuota?.monthlyBudgetUsd && projectedCost.projected > usageQuota.monthlyBudgetUsd && (
                <p className="text-xs text-destructive">
                  Exceeds budget by ${(projectedCost.projected - usageQuota.monthlyBudgetUsd).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Operation Breakdown */}
      {Object.keys(monthlySummary.byPurpose).length > 0 && (
        <div className="rounded-lg border bg-card">
          <div className="border-b px-5 py-3">
            <h2 className="font-semibold">Operations Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operation</TableHead>
                  <TableHead>Calls</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Avg Cost/Call</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(monthlySummary.byPurpose)
                  .sort((a, b) => b[1].costUsd - a[1].costUsd)
                  .map(([purpose, data]) => (
                    <TableRow key={purpose}>
                      <TableCell className="font-medium capitalize">
                        {purpose.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell>{data.calls.toLocaleString()}</TableCell>
                      <TableCell>${data.costUsd.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        ${data.calls > 0 ? (data.costUsd / data.calls).toFixed(4) : "0.00"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="h-48 animate-pulse rounded-lg border bg-muted" />
      ) : dailyCosts.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <DollarSign className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            No AI usage data for {range.label}.
          </p>
        </div>
      ) : (
        <>
          {/* Daily Cost Chart */}
          <div className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold mb-4">Daily Cost Trend</h2>
            <div role="img" aria-label="Bar chart showing daily AI costs for the selected month">
              <SimpleBarChart
                data={dailyChartData}
                height={220}
                valueFormatter={(v) => `$${v.toFixed(2)}`}
              />
            </div>
          </div>

          {/* Cost by Purpose */}
          {purposeChartData.length > 0 && (
            <div className="rounded-lg border bg-card p-5">
              <h2 className="font-semibold mb-4">Cost by Task Type</h2>
              <div role="img" aria-label="Bar chart showing AI costs broken down by task type">
                <SimpleBarChart
                  data={purposeChartData}
                  height={200}
                  valueFormatter={(v) => `$${v.toFixed(2)}`}
                />
              </div>
            </div>
          )}

          {/* Detailed daily table */}
          <DailyBreakdownTable dailyCosts={dailyCosts} />
        </>
      )}

      {/* Dead Letter Queue — Failed Grading Attempts */}
      {dlqEntries.length > 0 && (
        <div className="rounded-lg border bg-card">
          <div className="border-b px-5 py-3 flex items-center gap-2">
            <Skull className="h-4 w-4 text-red-500" />
            <h2 className="font-semibold">Failed Grading Attempts</h2>
            <span className="ml-auto text-xs text-muted-foreground">{dlqEntries.length} entries</span>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submission</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Step</TableHead>
                  <TableHead>Error</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Last Attempt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dlqEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono text-xs truncate max-w-[120px]">
                      {entry.submissionId?.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="font-mono text-xs truncate max-w-[120px]">
                      {entry.questionSubmissionId?.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="text-xs capitalize">
                      {entry.pipelineStep}
                    </TableCell>
                    <TableCell className="text-xs text-red-600 dark:text-red-400 max-w-[250px] truncate">
                      {entry.error}
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {entry.attempts}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {entry.lastAttemptAt && typeof entry.lastAttemptAt === 'object' && entry.lastAttemptAt.toDate
                        ? entry.lastAttemptAt.toDate().toLocaleDateString()
                        : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      {dlqLoading && (
        <div className="h-24 animate-pulse rounded-lg border bg-muted" />
      )}
    </div>
  );
}

function DailyBreakdownTable({ dailyCosts }: { dailyCosts: { date: string; totalCalls: number; totalInputTokens: number; totalOutputTokens: number; totalCostUsd: number }[] }) {
  const sorted = useMemo(() => [...dailyCosts].sort((a, b) => b.date.localeCompare(a.date)), [dailyCosts]);
  const { paginatedItems, currentPage, pageSize, totalItems, setCurrentPage, setPageSize } =
    usePagination(sorted, 25);

  return (
    <div className="rounded-lg border bg-card">
      <div className="border-b px-5 py-3">
        <h2 className="font-semibold">Daily Breakdown</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Calls</TableHead>
              <TableHead>Input Tokens</TableHead>
              <TableHead>Output Tokens</TableHead>
              <TableHead>Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((day) => (
              <TableRow key={day.date}>
                <TableCell className="font-mono text-xs">
                  {day.date}
                </TableCell>
                <TableCell>
                  {day.totalCalls.toLocaleString()}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {day.totalInputTokens.toLocaleString()}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {day.totalOutputTokens.toLocaleString()}
                </TableCell>
                <TableCell className="font-medium">
                  ${day.totalCostUsd.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        totalItems={totalItems}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
