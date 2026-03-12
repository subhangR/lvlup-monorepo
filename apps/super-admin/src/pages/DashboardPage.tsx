import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { getFirebaseServices } from "@levelup/shared-services";
import { useAuthStore, useCurrentUser } from "@levelup/shared-stores";
import type { Tenant, PlatformActivityLog } from "@levelup/shared-types";
import { Building2, Users, ClipboardList, BookOpen, AlertCircle, Plus, Activity, Settings, ArrowRight, TrendingUp, TrendingDown, UserCheck, Zap } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  LogoutButton,
  StatCard,
  StatusBadge,
  PageHeader,
  Skeleton,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Badge,
} from "@levelup/shared-ui";

const PLAN_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2, 160 60% 45%))",
  "hsl(var(--chart-3, 30 80% 55%))",
  "hsl(var(--chart-4, 280 65% 60%))",
  "hsl(var(--chart-5, 340 75% 55%))",
];

const ACTION_LABELS: Record<string, string> = {
  tenant_created: "Tenant created",
  tenant_updated: "Tenant updated",
  tenant_deactivated: "Tenant deactivated",
  tenant_reactivated: "Tenant reactivated",
  user_created: "User created",
  users_bulk_imported: "Users bulk imported",
};

function usePlatformStats() {
  return useQuery({
    queryKey: ["platform", "stats"],
    queryFn: async () => {
      const { db } = getFirebaseServices();
      const tenantsSnap = await getDocs(collection(db, "tenants"));
      const tenants = tenantsSnap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Tenant,
      );

      let totalUsers = 0;
      let totalExams = 0;
      let totalSpaces = 0;
      for (const t of tenants) {
        totalUsers +=
          (t.stats?.totalStudents ?? 0) + (t.stats?.totalTeachers ?? 0);
        totalExams += t.stats?.totalExams ?? 0;
        totalSpaces += t.stats?.totalSpaces ?? 0;
      }

      // Growth metrics
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const thisWeekStart = new Date(now);
      thisWeekStart.setDate(now.getDate() - 7);

      let newTenantsThisMonth = 0;
      let newTenantsLastMonth = 0;

      for (const t of tenants) {
        const createdAt = t.createdAt as unknown as { seconds?: number; toDate?: () => Date };
        const createdDate = createdAt?.toDate?.() ?? (createdAt?.seconds ? new Date(createdAt.seconds * 1000) : null);
        if (createdDate) {
          if (createdDate >= thisMonthStart) newTenantsThisMonth++;
          else if (createdDate >= lastMonthStart && createdDate < thisMonthStart) newTenantsLastMonth++;
        }
      }

      // Active users (last 7 days) — count users with recent lastLoginAt
      let activeUsers7d = 0;
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      try {
        const usersSnap = await getDocs(
          query(
            collection(db, "users"),
            where("lastLoginAt", ">=", sevenDaysAgo),
          ),
        );
        activeUsers7d = usersSnap.size;
      } catch {
        // lastLoginAt index may not exist yet
      }

      return {
        totalTenants: tenants.length,
        activeTenants: tenants.filter((t) => t.status === "active").length,
        trialTenants: tenants.filter((t) => t.status === "trial").length,
        totalUsers,
        totalExams,
        totalSpaces,
        tenants,
        newTenantsThisMonth,
        newTenantsLastMonth,
        activeUsers7d,
      };
    },
    staleTime: 60 * 1000,
  });
}

function useActivityFeed() {
  return useQuery({
    queryKey: ["platform", "activityFeed"],
    queryFn: async () => {
      const { db } = getFirebaseServices();
      const snap = await getDocs(
        query(
          collection(db, "platformActivityLog"),
          orderBy("createdAt", "desc"),
          limit(10),
        ),
      );
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PlatformActivityLog);
    },
    staleTime: 30 * 1000,
  });
}

function formatTimestamp(ts: unknown): string {
  const t = ts as { seconds?: number; toDate?: () => Date } | undefined;
  if (!t) return "";
  const d = t.toDate?.() ?? (t.seconds ? new Date(t.seconds * 1000) : null);
  if (!d) return "";
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function GrowthIndicator({ current, previous }: { current: number; previous: number }) {
  if (previous === 0 && current === 0) return null;
  const pct = previous === 0 ? 100 : Math.round(((current - previous) / previous) * 100);
  const isUp = pct >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${isUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
      {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {isUp ? "+" : ""}{pct}%
    </span>
  );
}

export default function DashboardPage() {
  const { logout } = useAuthStore();
  const user = useCurrentUser();
  const { data: stats, isLoading, isError, error, refetch } = usePlatformStats();
  const { data: activityFeed, isLoading: feedLoading } = useActivityFeed();

  const planData = useMemo(() => {
    if (!stats?.tenants) return [];
    const plans: Record<string, number> = {};
    for (const t of stats.tenants) {
      const plan = t.subscription?.plan ?? "none";
      plans[plan] = (plans[plan] ?? 0) + (t.stats?.totalStudents ?? 0) + (t.stats?.totalTeachers ?? 0);
    }
    return Object.entries(plans).map(([name, value]) => ({ name, value }));
  }, [stats]);

  const topTenants = useMemo(() => {
    if (!stats?.tenants) return [];
    return [...stats.tenants]
      .sort((a, b) => {
        const aUsers = (a.stats?.totalStudents ?? 0) + (a.stats?.totalTeachers ?? 0);
        const bUsers = (b.stats?.totalStudents ?? 0) + (b.stats?.totalTeachers ?? 0);
        return bUsers - aUsers;
      })
      .slice(0, 8)
      .map((t) => ({
        name: t.name.length > 15 ? t.name.slice(0, 15) + "..." : t.name,
        users: (t.stats?.totalStudents ?? 0) + (t.stats?.totalTeachers ?? 0),
      }));
  }, [stats]);

  const statCards = [
    {
      label: "Total Tenants",
      value: stats?.totalTenants ?? 0,
      icon: Building2,
      sub: `${stats?.activeTenants ?? 0} active, ${stats?.trialTenants ?? 0} trial`,
    },
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      sub: "across all tenants",
    },
    {
      label: "Total Exams",
      value: stats?.totalExams ?? 0,
      icon: ClipboardList,
      sub: "across all tenants",
    },
    {
      label: "Total Spaces",
      value: stats?.totalSpaces ?? 0,
      icon: BookOpen,
      sub: "across all tenants",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Super Admin Dashboard"
        description={`Welcome back, ${user?.displayName || user?.email || "Admin"}`}
        actions={
          <LogoutButton
            onLogout={logout}
            className="inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium hover:bg-accent transition-colors"
          >
            Sign Out
          </LogoutButton>
        }
      />

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load data</AlertTitle>
          <AlertDescription className="flex items-center gap-2">
            {error instanceof Error ? error.message : "An unexpected error occurred."}
            <Button variant="link" className="h-auto p-0" onClick={() => refetch()}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-6" role="status" aria-label="Loading dashboard">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pb-4 pt-4 px-4 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-5 w-32 mb-4" />
                  <Skeleton className="h-[200px] w-full rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => (
              <StatCard
                key={card.label}
                label={card.label}
                value={card.value}
                icon={card.icon}
                subtext={card.sub}
              />
            ))}
          </div>

          {/* Growth Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">New Tenants</p>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold tabular-nums">{stats?.newTenantsThisMonth ?? 0}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">this month</span>
                  <GrowthIndicator current={stats?.newTenantsThisMonth ?? 0} previous={stats?.newTenantsLastMonth ?? 0} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Active Users (7d)</p>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                    <UserCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold tabular-nums">{stats?.activeUsers7d ?? 0}</p>
                <p className="mt-1 text-xs text-muted-foreground">logged in within 7 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Engagement Rate</p>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                    <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold tabular-nums">
                  {stats?.totalUsers
                    ? `${Math.round(((stats.activeUsers7d ?? 0) / stats.totalUsers) * 100)}%`
                    : "—"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">active / total users</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          {stats?.tenants && stats.tenants.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Top Tenants by Users</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={topTenants} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                      <XAxis
                        dataKey="name"
                        className="text-xs"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        className="text-xs"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: "hsl(var(--muted))", radius: 4 }}
                        contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--card-foreground))" }}
                        labelStyle={{ color: "hsl(var(--card-foreground))" }}
                        itemStyle={{ color: "hsl(var(--card-foreground))" }}
                      />
                      <Bar dataKey="users" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={48} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Users by Plan</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 flex justify-center">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={planData}
                        innerRadius={65}
                        outerRadius={100}
                        dataKey="value"
                        nameKey="name"
                        paddingAngle={2}
                        stroke="hsl(var(--background))"
                        strokeWidth={2}
                      >
                        {planData.map((_, index) => (
                          <Cell key={index} fill={PLAN_COLORS[index % PLAN_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--card-foreground))" }}
                        labelStyle={{ color: "hsl(var(--card-foreground))" }}
                        itemStyle={{ color: "hsl(var(--card-foreground))" }}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(value: string) => (
                          <span className="text-xs text-muted-foreground capitalize">{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Activity Feed + Recent Tenants */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Activity Feed */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {feedLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-2 w-2 rounded-full" />
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-3.5 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !activityFeed?.length ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No recent activity</p>
                ) : (
                  <div className="space-y-0 divide-y divide-border">
                    {activityFeed.map((entry) => (
                      <div key={entry.id} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">
                            {ACTION_LABELS[entry.action] ?? entry.action}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {entry.actorEmail}
                            {entry.metadata?.tenantName ? ` — ${entry.metadata.tenantName}` : ""}
                            {entry.metadata?.displayName ? ` — ${entry.metadata.displayName}` : ""}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatTimestamp(entry.createdAt)}</p>
                        </div>
                        <Badge variant="secondary" className="shrink-0 text-[10px]">
                          {entry.action.split("_")[0]}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Tenants */}
            {stats?.tenants && stats.tenants.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">Recent Tenants</CardTitle>
                    <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                      <Link to="/tenants">
                        View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="divide-y divide-border rounded-lg border">
                    {stats.tenants.slice(0, 5).map((tenant) => (
                      <Link
                        key={tenant.id}
                        to={`/tenants/${tenant.id}`}
                        className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{tenant.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {tenant.tenantCode} &middot; {tenant.contactEmail}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 ml-4 shrink-0">
                          <span className="text-sm text-muted-foreground tabular-nums">
                            {(tenant.stats?.totalStudents ?? 0) +
                              (tenant.stats?.totalTeachers ?? 0)}{" "}
                            users
                          </span>
                          <StatusBadge status={tenant.status as "active" | "trial" | "suspended" | "expired" | "deactivated"}>
                            {tenant.status}
                          </StatusBadge>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { to: "/tenants", icon: Plus, title: "Create Tenant", desc: "Add a new organization" },
              { to: "/system", icon: Activity, title: "System Health", desc: "Monitor services" },
              { to: "/settings", icon: Settings, title: "Settings", desc: "Platform configuration" },
            ].map((action) => (
              <Button
                key={action.to}
                variant="outline"
                className="h-auto py-4 justify-start gap-3 hover:bg-muted/50 transition-colors"
                asChild
              >
                <Link to={action.to}>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <action.icon className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground font-normal">{action.desc}</p>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
