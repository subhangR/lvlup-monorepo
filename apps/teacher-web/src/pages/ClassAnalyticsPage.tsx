import { useState } from "react";
import { useCurrentTenantId } from "@levelup/shared-stores";
import {
  useClasses,
  useClassProgressSummary,
} from "@levelup/shared-hooks";
import {
  BarChart3,
  Users,
  BookOpen,
  ClipboardList,
  Trophy,
} from "lucide-react";
import {
  ScoreCard,
  ProgressRing,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@levelup/shared-ui";

export default function ClassAnalyticsPage() {
  const tenantId = useCurrentTenantId();
  const { data: classes = [] } = useClasses(tenantId);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const activeClassId = selectedClassId || classes[0]?.id || null;
  const { data: classSummary, isLoading } = useClassProgressSummary(
    tenantId,
    activeClassId,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Class Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Cross-system performance overview per class
          </p>
        </div>
        <Select
          value={activeClassId ?? "__none__"}
          onValueChange={(v) => setSelectedClassId(v === "__none__" ? null : v)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent>
            {classes.length === 0 && (
              <SelectItem value="__none__" disabled>No classes</SelectItem>
            )}
            {classes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-lg border bg-muted"
            />
          ))}
        </div>
      ) : !classSummary ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            {classes.length === 0
              ? "No classes created yet."
              : "No analytics data yet. Data will appear after exams are graded and spaces are used."}
          </p>
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <ScoreCard
              label="Students"
              value={classSummary.studentCount}
              icon={Users}
            />
            <ScoreCard
              label="Avg Exam Score"
              value={`${Math.round(classSummary.autograde.averageClassScore * 100)}%`}
              icon={ClipboardList}
            />
            <ScoreCard
              label="Avg Space Completion"
              value={`${Math.round(classSummary.levelup.averageClassCompletion)}%`}
              icon={BookOpen}
            />
            <ScoreCard
              label="At-Risk Students"
              value={classSummary.atRiskCount}
              icon={Users}
              trend={classSummary.atRiskCount > 0 ? "down" : "neutral"}
              trendValue={
                classSummary.atRiskCount > 0
                  ? "Needs attention"
                  : "All on track"
              }
            />
          </div>

          {/* AutoGrade + LevelUp side by side */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* AutoGrade Section */}
            <div className="rounded-lg border bg-card p-5 space-y-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-blue-500" />
                <h2 className="font-semibold">AutoGrade</h2>
              </div>
              <div className="flex items-center gap-6">
                <ProgressRing
                  value={classSummary.autograde.averageClassScore * 100}
                  label="Avg Score"
                />
                <div className="text-sm space-y-1">
                  <p>
                    Completion Rate:{" "}
                    <span className="font-medium">
                      {Math.round(classSummary.autograde.examCompletionRate * 100)}%
                    </span>
                  </p>
                </div>
              </div>

              {/* Top Performers */}
              {classSummary.autograde.topPerformers.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <Trophy className="h-3 w-3" /> Top Performers
                  </p>
                  <div className="space-y-1">
                    {classSummary.autograde.topPerformers.slice(0, 3).map((s) => (
                      <div
                        key={s.studentId}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>{s.name || s.studentId.slice(0, 8)}</span>
                        <span className="font-medium">
                          {Math.round(s.avgScore * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Performers */}
              {classSummary.autograde.bottomPerformers.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Needs Improvement
                  </p>
                  <div className="space-y-1">
                    {classSummary.autograde.bottomPerformers.slice(0, 3).map((s) => (
                      <div
                        key={s.studentId}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>{s.name || s.studentId.slice(0, 8)}</span>
                        <span className="font-medium text-red-600">
                          {Math.round(s.avgScore * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* LevelUp Section */}
            <div className="rounded-lg border bg-card p-5 space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-green-500" />
                <h2 className="font-semibold">LevelUp</h2>
              </div>
              <div className="flex items-center gap-6">
                <ProgressRing
                  value={classSummary.levelup.averageClassCompletion}
                  label="Avg Completion"
                />
                <div className="text-sm space-y-1">
                  <p>
                    Active Rate:{" "}
                    <span className="font-medium">
                      {Math.round(classSummary.levelup.activeStudentRate * 100)}%
                    </span>
                  </p>
                </div>
              </div>

              {/* Top Point Earners */}
              {classSummary.levelup.topPointEarners.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <Trophy className="h-3 w-3" /> Top Point Earners
                  </p>
                  <div className="space-y-1">
                    {classSummary.levelup.topPointEarners.slice(0, 5).map((s) => (
                      <div
                        key={s.studentId}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>{s.name || s.studentId.slice(0, 8)}</span>
                        <span className="font-medium">{s.points} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
