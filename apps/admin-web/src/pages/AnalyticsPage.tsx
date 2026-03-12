import { useState } from "react";
import { useCurrentTenantId } from "@levelup/shared-stores";
import {
  useClasses,
  useStudents,
  useClassSummaries,
} from "@levelup/shared-hooks/queries";
import {
  ScoreCard,
  SimpleBarChart,
  ProgressRing,
} from "@levelup/shared-ui";
import {
  BarChart3,
  Users,
  AlertTriangle,
  TrendingUp,
  GraduationCap,
} from "lucide-react";

export default function AnalyticsPage() {
  const tenantId = useCurrentTenantId();
  const { data: classes = [] } = useClasses(tenantId);
  const { data: students = [] } = useStudents(tenantId);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const classIds = classes.map((c) => c.id);
  const classSummaryResults = useClassSummaries(tenantId, classIds);
  const classSummaries = classSummaryResults
    .map((r) => r.data)
    .filter(Boolean);

  const totalAtRisk = classSummaries.reduce(
    (sum, cs) => sum + (cs?.atRiskCount ?? 0),
    0,
  );

  const avgClassScore =
    classSummaries.length > 0
      ? classSummaries.reduce(
          (sum, cs) => sum + (cs?.autograde.averageClassScore ?? 0),
          0,
        ) / classSummaries.length
      : 0;

  const avgCompletion =
    classSummaries.length > 0
      ? classSummaries.reduce(
          (sum, cs) => sum + (cs?.levelup.averageClassCompletion ?? 0),
          0,
        ) / classSummaries.length
      : 0;

  // Class performance comparison chart
  const classPerformanceData = classSummaries
    .filter((cs) => cs != null)
    .map((cs) => ({
      label: cs!.className || cs!.classId.slice(0, 8),
      value: Math.round((cs!.autograde.averageClassScore ?? 0) * 100),
    }))
    .sort((a, b) => b.value - a.value);

  // Class completion chart
  const classCompletionData = classSummaries
    .filter((cs) => cs != null)
    .map((cs) => ({
      label: cs!.className || cs!.classId.slice(0, 8),
      value: Math.round(cs!.levelup.averageClassCompletion ?? 0),
      color: "hsl(var(--primary))",
    }))
    .sort((a, b) => b.value - a.value);

  // At-risk students by class — theme-aware color
  const atRiskByClass = classSummaries
    .filter((cs) => cs != null && cs.atRiskCount > 0)
    .map((cs) => ({
      label: cs!.className || cs!.classId.slice(0, 8),
      value: cs!.atRiskCount,
      color: "hsl(var(--destructive))",
    }))
    .sort((a, b) => b.value - a.value);

  const selectedSummary = selectedClassId
    ? classSummaries.find((cs) => cs?.classId === selectedClassId)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Student performance, class comparisons, and at-risk indicators
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ScoreCard
          label="Avg Exam Score"
          value={`${Math.round(avgClassScore * 100)}%`}
          icon={BarChart3}
        />
        <ScoreCard
          label="Avg Space Completion"
          value={`${Math.round(avgCompletion)}%`}
          icon={TrendingUp}
        />
        <ScoreCard
          label="At-Risk Students"
          value={totalAtRisk}
          icon={AlertTriangle}
          trend={totalAtRisk > 0 ? "down" : "neutral"}
          trendValue={totalAtRisk > 0 ? "Needs attention" : "All good"}
        />
        <ScoreCard
          label="Total Students"
          value={students.length}
          icon={Users}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Exam Performance by Class */}
        {classPerformanceData.length > 0 && (
          <div className="rounded-lg border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold">Exam Performance by Class</h2>
            </div>
            <div role="img" aria-label="Bar chart comparing exam performance across classes">
              <SimpleBarChart
                data={classPerformanceData}
                maxValue={100}
                height={220}
                valueFormatter={(v) => `${v}%`}
              />
            </div>
          </div>
        )}

        {/* Space Completion by Class */}
        {classCompletionData.length > 0 && (
          <div className="rounded-lg border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold">Space Completion by Class</h2>
            </div>
            <div role="img" aria-label="Bar chart comparing space completion rates across classes">
              <SimpleBarChart
                data={classCompletionData}
                maxValue={100}
                height={220}
                valueFormatter={(v) => `${v}%`}
              />
            </div>
          </div>
        )}
      </div>

      {/* At-Risk Distribution */}
      {atRiskByClass.length > 0 && (
        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h2 className="font-semibold">At-Risk Students by Class</h2>
          </div>
          <div role="img" aria-label="Bar chart showing at-risk student counts by class">
            <SimpleBarChart data={atRiskByClass} height={180} />
          </div>
        </div>
      )}

      {/* Class Drill-Down */}
      <div className="rounded-lg border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold">Class Detail</h2>
        </div>

        {/* Class selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() =>
                setSelectedClassId(
                  selectedClassId === cls.id ? null : cls.id,
                )
              }
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedClassId === cls.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cls.name}
            </button>
          ))}
        </div>

        {selectedSummary ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <div role="img" aria-label={`Exam average score: ${Math.round((selectedSummary.autograde.averageClassScore ?? 0) * 100)}%`}>
                  <ProgressRing
                    value={
                      (selectedSummary.autograde.averageClassScore ?? 0) * 100
                    }
                    size={64}
                    strokeWidth={6}
                    label="Exam Avg"
                  />
                </div>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-sm text-muted-foreground">Students</p>
                <p className="text-2xl font-bold">
                  {selectedSummary.studentCount}
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-sm text-muted-foreground">At-Risk</p>
                <p className="text-2xl font-bold text-destructive">
                  {selectedSummary.atRiskCount}
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    selectedSummary.autograde.examCompletionRate * 100,
                  )}
                  %
                </p>
              </div>
            </div>

            {/* Top & Bottom Performers */}
            <div className="grid gap-4 md:grid-cols-2">
              {selectedSummary.autograde.topPerformers.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 text-primary">
                    Top Performers
                  </h4>
                  <div className="space-y-1">
                    {selectedSummary.autograde.topPerformers
                      .slice(0, 5)
                      .map((p) => (
                        <div
                          key={p.studentId}
                          className="flex items-center justify-between rounded bg-primary/10 px-3 py-1.5 text-sm"
                        >
                          <span>{p.name || p.studentId.slice(0, 10)}</span>
                          <span className="font-medium text-primary">
                            {Math.round(p.avgScore * 100)}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              {selectedSummary.autograde.bottomPerformers.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 text-destructive">
                    Needs Improvement
                  </h4>
                  <div className="space-y-1">
                    {selectedSummary.autograde.bottomPerformers
                      .slice(0, 5)
                      .map((p) => (
                        <div
                          key={p.studentId}
                          className="flex items-center justify-between rounded bg-destructive/10 px-3 py-1.5 text-sm"
                        >
                          <span>{p.name || p.studentId.slice(0, 10)}</span>
                          <span className="font-medium text-destructive">
                            {Math.round(p.avgScore * 100)}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {classes.length > 0
              ? "Select a class above to view detailed analytics"
              : "No classes available"}
          </p>
        )}
      </div>
    </div>
  );
}
