import { useState } from "react";
import { useCurrentTenantId } from "@levelup/shared-stores";
import { useExams, useExamAnalytics } from "@levelup/shared-hooks";
import {
  BarChart3,
  ClipboardList,
  Users,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  ScoreCard,
  SimpleBarChart,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@levelup/shared-ui";
import type { Exam } from "@levelup/shared-types";

export default function ExamAnalyticsPage() {
  const tenantId = useCurrentTenantId();
  const { data: exams = [] } = useExams(tenantId);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  const gradedExams = exams.filter(
    (e: Exam) => e.status === "graded" || e.status === "results_released",
  );
  const activeExamId = selectedExamId || gradedExams[0]?.id || null;
  const { data: analytics, isLoading } = useExamAnalytics(
    tenantId,
    activeExamId,
  );

  // Build score distribution chart data
  const distributionData = analytics?.scoreDistribution.buckets.map((b) => ({
    label: `${b.min}-${b.max}%`,
    value: b.count,
    color:
      b.min >= 70
        ? "#22c55e"
        : b.min >= 40
          ? "#f59e0b"
          : "#ef4444",
  })) ?? [];

  // Question analytics sorted by difficulty
  const questionEntries = analytics
    ? Object.values(analytics.questionAnalytics).sort(
        (a, b) => a.difficultyIndex - b.difficultyIndex,
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Exam Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Per-exam grade distribution and question analysis
          </p>
        </div>
        <Select
          value={activeExamId ?? "__none__"}
          onValueChange={(v) => setSelectedExamId(v === "__none__" ? null : v)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select exam" />
          </SelectTrigger>
          <SelectContent>
            {gradedExams.length === 0 && (
              <SelectItem value="__none__" disabled>No graded exams</SelectItem>
            )}
            {gradedExams.map((e: Exam) => (
              <SelectItem key={e.id} value={e.id}>
                {e.title}
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
      ) : !analytics ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            {gradedExams.length === 0
              ? "No graded exams yet. Analytics appear after exam results are released."
              : "No analytics data for this exam yet."}
          </p>
        </div>
      ) : (
        <>
          {/* Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ScoreCard
              label="Total Submissions"
              value={analytics.totalSubmissions}
              icon={Users}
            />
            <ScoreCard
              label="Average Score"
              value={`${Math.round(analytics.avgPercentage)}%`}
              icon={TrendingUp}
            />
            <ScoreCard
              label="Pass Rate"
              value={`${Math.round(analytics.passRate * 100)}%`}
              icon={Target}
            />
            <ScoreCard
              label="Median Score"
              value={analytics.medianScore}
              icon={ClipboardList}
            />
          </div>

          {/* Score Distribution */}
          {distributionData.length > 0 && (
            <div className="rounded-lg border bg-card p-5">
              <h2 className="font-semibold mb-4">Grade Distribution</h2>
              <SimpleBarChart
                data={distributionData}
                height={220}
                showValues
                valueFormatter={(v) => `${v}`}
              />
            </div>
          )}

          {/* Per-Question Analysis */}
          {questionEntries.length > 0 && (
            <div className="rounded-lg border bg-card">
              <div className="border-b px-5 py-3">
                <h2 className="font-semibold">Per-Question Analysis</h2>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Avg Score</TableHead>
                    <TableHead>Avg %</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Common Mistakes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questionEntries.map((q) => (
                    <TableRow key={q.questionId}>
                      <TableCell className="font-medium">
                        Q{q.questionId}
                      </TableCell>
                      <TableCell>
                        {q.avgScore.toFixed(1)}/{q.maxScore}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            q.avgPercentage >= 70
                              ? "text-green-600"
                              : q.avgPercentage >= 40
                                ? "text-yellow-600"
                                : "text-red-600"
                          }
                        >
                          {Math.round(q.avgPercentage)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            q.difficultyIndex >= 0.7
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : q.difficultyIndex >= 0.4
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {q.difficultyIndex >= 0.7
                            ? "Easy"
                            : q.difficultyIndex >= 0.4
                              ? "Medium"
                              : "Hard"}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                        {q.commonMistakes.slice(0, 2).join("; ") || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Topic Performance */}
          {Object.keys(analytics.topicPerformance).length > 0 && (
            <div className="rounded-lg border bg-card p-5">
              <h2 className="font-semibold mb-4">Topic Performance</h2>
              <SimpleBarChart
                data={Object.entries(analytics.topicPerformance).map(
                  ([topic, perf]) => ({
                    label: topic,
                    value: perf.avgPercentage,
                    color:
                      perf.avgPercentage >= 70
                        ? "#22c55e"
                        : perf.avgPercentage >= 40
                          ? "#f59e0b"
                          : "#ef4444",
                  }),
                )}
                maxValue={100}
                height={180}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
