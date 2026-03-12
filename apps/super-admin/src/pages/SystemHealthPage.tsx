import { Activity, Server, Database, Zap, RefreshCw, AlertCircle, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, limit, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFirebaseServices, callSaveTenant, callGetPlatformSummary } from "@levelup/shared-services";
import type { Tenant, HealthSummaryResponse } from "@levelup/shared-types";
import {
  Button,
  PageHeader,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  Alert,
  AlertDescription,
  AlertTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@levelup/shared-ui";

type ServiceStatus = "operational" | "degraded" | "down";

interface ProbeResult {
  status: ServiceStatus;
  latencyMs?: number;
  detail?: string;
}

interface HealthData {
  probes: {
    auth: ProbeResult;
    firestore: ProbeResult;
    functions: ProbeResult;
    aiPipeline: ProbeResult;
  };
  metrics: {
    avgResponseMs: number | null;
    totalUsers: number | null;
    activeTenants: number | null;
  };
  checkedAt: string;
}

function getTodayDateString(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function deriveOverallStatus(probes: HealthData["probes"]): ServiceStatus {
  const statuses = Object.values(probes).map((p) => p.status);
  if (statuses.some((s) => s === "down")) return "down";
  if (statuses.some((s) => s === "degraded")) return "degraded";
  return "operational";
}

function mapServiceStatusToHealthStatus(status: ServiceStatus): "healthy" | "degraded" | "down" {
  if (status === "operational") return "healthy";
  return status;
}

async function writeHealthSnapshot(probes: HealthData["probes"]): Promise<void> {
  const { db } = getFirebaseServices();
  const dateStr = getTodayDateString();
  const overall = deriveOverallStatus(probes);
  const healthStatus = mapServiceStatusToHealthStatus(overall);

  const services: Record<string, { status: string; latencyMs?: number }> = {};
  for (const [key, probe] of Object.entries(probes)) {
    services[key] = {
      status: probe.status,
      ...(probe.latencyMs !== undefined ? { latencyMs: probe.latencyMs } : {}),
    };
  }

  await setDoc(doc(db, "platformHealthSnapshots", dateStr), {
    date: dateStr,
    status: healthStatus,
    services,
    checkedAt: new Date(),
  });
}

async function runHealthChecks(): Promise<HealthData> {
  const { db } = getFirebaseServices();
  const auth = getAuth();

  let firestoreResult: ProbeResult;
  let tenants: Tenant[] = [];
  const fsStart = performance.now();
  try {
    const snap = await getDocs(query(collection(db, "tenants"), limit(50)));
    const latencyMs = Math.round(performance.now() - fsStart);
    tenants = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Tenant);
    firestoreResult = { status: "operational", latencyMs };
  } catch {
    const latencyMs = Math.round(performance.now() - fsStart);
    firestoreResult = { status: "down", latencyMs, detail: "Firestore unavailable" };
  }

  const authResult: ProbeResult = auth.currentUser !== null
    ? { status: "operational" }
    : { status: "degraded", detail: "No authenticated user" };

  let functionsResult: ProbeResult;
  try {
    await callSaveTenant({ data: {} });
    functionsResult = { status: "operational" };
  } catch (err: unknown) {
    const code = (typeof err === "object" && err !== null && "code" in err ? (err as Record<string, string>).code : "") ?? "";
    if (
      code === "functions/unavailable" ||
      code === "functions/internal" ||
      !code.startsWith("functions/")
    ) {
      functionsResult = { status: "down", detail: `Functions endpoint unreachable (${code})` };
    } else {
      functionsResult = { status: "operational" };
    }
  }

  const aiActive = tenants.some(
    (t) => t.settings?.geminiKeySet === true
  );
  const aiResult: ProbeResult = firestoreResult.status === "down"
    ? { status: "down", detail: "Cannot reach Firestore" }
    : aiActive
    ? { status: "operational" }
    : { status: "degraded", detail: "No tenants with AI configured" };

  const totalUsers = tenants.reduce(
    (sum, t) =>
      sum +
      (t.stats?.totalStudents ?? 0) +
      (t.stats?.totalTeachers ?? 0),
    0
  );
  const activeTenants = tenants.filter(
    (t) => t.status === "active"
  ).length;

  const probes = {
    auth: authResult,
    firestore: firestoreResult,
    functions: functionsResult,
    aiPipeline: aiResult,
  };

  // Write snapshot to Firestore on each manual health check
  try {
    await writeHealthSnapshot(probes);
  } catch {
    // Non-critical — don't fail the health check if snapshot write fails
  }

  return {
    probes,
    metrics: {
      avgResponseMs: firestoreResult.latencyMs ?? null,
      totalUsers: tenants.length > 0 ? totalUsers : null,
      activeTenants: tenants.length > 0 ? activeTenants : null,
    },
    checkedAt: new Date().toLocaleTimeString(),
  };
}

function useHealthChecks() {
  return useQuery<HealthData>({
    queryKey: ["platform", "healthChecks"],
    queryFn: runHealthChecks,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });
}

function useHealthHistory() {
  return useQuery<HealthSummaryResponse>({
    queryKey: ["platform", "healthHistory"],
    queryFn: async () => {
      const result = await callGetPlatformSummary({ scope: "health" });
      return result.healthSummary ?? { snapshots: [], errorCount24h: 0 };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

const statusConfig: Record<ServiceStatus, { icon: typeof CheckCircle2; label: string; colorClass: string; bgClass: string; dotClass: string }> = {
  operational: {
    icon: CheckCircle2,
    label: "Operational",
    colorClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/50",
    dotClass: "bg-emerald-500",
  },
  degraded: {
    icon: AlertTriangle,
    label: "Degraded",
    colorClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/50",
    dotClass: "bg-amber-500",
  },
  down: {
    icon: XCircle,
    label: "Down",
    colorClass: "text-red-600 dark:text-red-400",
    bgClass: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800/50",
    dotClass: "bg-red-500",
  },
};

const healthDotColors: Record<string, string> = {
  healthy: "bg-emerald-500",
  degraded: "bg-amber-500",
  down: "bg-red-500",
};

export default function SystemHealthPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useHealthChecks();
  const { data: healthHistory, isLoading: isHistoryLoading } = useHealthHistory();

  const overallStatus: ServiceStatus = !data
    ? "operational"
    : Object.values(data.probes).some((p) => p.status === "down")
    ? "down"
    : Object.values(data.probes).some((p) => p.status === "degraded")
    ? "degraded"
    : "operational";

  const overallLabels: Record<ServiceStatus, string> = {
    operational: "All Systems Operational",
    degraded: "Some Services Degraded",
    down: "Service Disruption Detected",
  };

  const services = data
    ? [
        { name: "Firebase Auth", icon: Server, description: "Authentication service", result: data.probes.auth },
        { name: "Firestore", icon: Database, description: "Primary database", result: data.probes.firestore },
        { name: "Cloud Functions", icon: Zap, description: "Serverless compute", result: data.probes.functions },
        { name: "AI Grading Pipeline", icon: Activity, description: "Gemini AI evaluation", result: data.probes.aiPipeline },
      ]
    : [];

  const overallConfig = statusConfig[overallStatus];

  // Build the 30-day snapshot array (pad with empty days if fewer than 30)
  const snapshotsForDisplay = (() => {
    const snapshots = healthHistory?.snapshots ?? [];
    // Create a map of date -> status
    const statusMap = new Map<string, string>();
    for (const s of snapshots) {
      statusMap.set(s.date, s.status);
    }

    // Generate last 30 dates
    const days: Array<{ date: string; status: string }> = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      days.push({
        date: dateStr,
        status: statusMap.get(dateStr) ?? "no-data",
      });
    }
    return days;
  })();

  // Error rate display value
  const errorRateValue = (() => {
    if (isHistoryLoading) return null;
    if (!healthHistory) return "--";
    return String(healthHistory.errorCount24h);
  })();

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Health"
        description="Monitor platform services and infrastructure status"
        actions={
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            {isFetching ? "Checking..." : "Refresh"}
          </Button>
        }
      />

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to run health checks</AlertTitle>
          <AlertDescription className="flex items-center gap-2">
            {error instanceof Error ? error.message : "An unexpected error occurred."}
            <Button variant="link" className="h-auto p-0" onClick={() => refetch()}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Overall status banner */}
      <Card className={`border ${isLoading || isFetching ? "" : overallConfig.bgClass}`}>
        <CardContent className="p-6">
          {isLoading || isFetching ? (
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-6 w-48" />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${overallStatus === "operational" ? "bg-emerald-100 dark:bg-emerald-900/50" : overallStatus === "degraded" ? "bg-amber-100 dark:bg-amber-900/50" : "bg-red-100 dark:bg-red-900/50"}`}>
                  <overallConfig.icon className={`h-4 w-4 ${overallConfig.colorClass}`} />
                </div>
                <div>
                  <p className={`font-semibold ${overallConfig.colorClass}`}>
                    {overallLabels[overallStatus]}
                  </p>
                </div>
              </div>
              {data && (
                <p className="text-xs text-muted-foreground">
                  Last checked: {data.checkedAt}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          services.map((svc) => {
            const cfg = statusConfig[svc.result.status];
            return (
              <Card key={svc.name} className="transition-shadow hover:shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <svc.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{svc.name}</p>
                        <p className="text-sm text-muted-foreground">{svc.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.bgClass} ${cfg.colorClass}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotClass}`} />
                        {cfg.label}
                      </div>
                      {svc.result.latencyMs !== undefined && (
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {svc.result.latencyMs}ms
                        </span>
                      )}
                    </div>
                  </div>
                  {svc.result.detail && (
                    <p className="mt-3 text-xs text-muted-foreground rounded-md bg-muted/50 px-3 py-2">
                      {svc.result.detail}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* 30-Day Uptime History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">30-Day Uptime History</CardTitle>
        </CardHeader>
        <CardContent>
          {isHistoryLoading ? (
            <div className="flex items-center gap-1">
              {Array.from({ length: 30 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-2 rounded-sm" />
              ))}
            </div>
          ) : (
            <TooltipProvider>
              <div className="flex items-end gap-1">
                {snapshotsForDisplay.map((day) => (
                  <Tooltip key={day.date}>
                    <TooltipTrigger asChild>
                      <div
                        className={`h-8 w-2 rounded-sm transition-colors ${
                          day.status === "no-data"
                            ? "bg-muted"
                            : healthDotColors[day.status] ?? "bg-muted"
                        }`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {day.date}: {day.status === "no-data" ? "No data" : day.status}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  Healthy
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                  Degraded
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                  Down
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-muted" />
                  No data
                </div>
              </div>
            </TooltipProvider>
          )}
        </CardContent>
      </Card>

      {/* Platform Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Platform Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                label: "Avg Response Time",
                value: isLoading || isFetching ? null : data?.metrics.avgResponseMs !== null ? `${data?.metrics.avgResponseMs}ms` : "--",
                sub: "Firestore read latency",
              },
              {
                label: "Total Users",
                value: isLoading || isFetching ? null : data?.metrics.totalUsers !== null ? data?.metrics.totalUsers?.toLocaleString() : "--",
                sub: data?.metrics.activeTenants !== null
                  ? `across ${data?.metrics.activeTenants} active tenant${data?.metrics.activeTenants !== 1 ? "s" : ""}`
                  : undefined,
              },
              {
                label: "Errors (24h)",
                value: errorRateValue,
                sub: healthHistory
                  ? `${healthHistory.errorCount24h} error${healthHistory.errorCount24h !== 1 ? "s" : ""} in the last 24 hours`
                  : "Loading error data...",
              },
            ].map((metric) => (
              <div key={metric.label} className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                {metric.value === null ? (
                  <Skeleton className="mt-1 h-8 w-16" />
                ) : (
                  <p className="mt-1 text-2xl font-bold tabular-nums">{metric.value}</p>
                )}
                {metric.sub && (
                  <p className="text-xs text-muted-foreground mt-1">{metric.sub}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
