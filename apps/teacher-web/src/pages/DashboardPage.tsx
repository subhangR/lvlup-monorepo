import { Link } from "react-router-dom";
import { useCurrentUser, useCurrentTenantId } from "@levelup/shared-stores";
import {
  useSpaces,
  useExams,
  useSubmissions,
  useClasses,
  useStudents,
} from "@levelup/shared-hooks";
import { useClassSummaries } from "@levelup/shared-hooks";
import { BookOpen, ClipboardList, Users, ArrowRight, AlertTriangle, BarChart3 } from "lucide-react";
import {
  ScoreCard,
  SimpleBarChart,
  ClassHeatmap,
  AtRiskBadge,
  Card,
  CardContent,
  Skeleton,
  FadeIn,
  EmptyState,
} from "@levelup/shared-ui";
import type { Space } from "@levelup/shared-types";
import type { Exam } from "@levelup/shared-types";
import type { Submission } from "@levelup/shared-types";

export default function DashboardPage() {
  const user = useCurrentUser();
  const tenantId = useCurrentTenantId();

  const { data: spaces = [], isLoading: spacesLoading } = useSpaces(tenantId);
  const { data: exams = [], isLoading: examsLoading } = useExams(tenantId);
  const { data: submissions = [] } = useSubmissions(tenantId, {
    status: "ready_for_review",
  });
  const { data: classes = [], isLoading: classesLoading } = useClasses(tenantId);
  const { data: students = [], isLoading: studentsLoading } = useStudents(tenantId);

  const classIds = classes.map((c) => c.id);
  const classSummaryResults = useClassSummaries(tenantId, classIds);
  const classSummaries = classSummaryResults.map((r) => r.data).filter(Boolean);

  const activeExams = exams.filter((e: Exam) => e.status !== "archived" && e.status !== "draft");

  const atRiskCount = classSummaries.reduce((sum, cs) => sum + (cs?.atRiskCount ?? 0), 0);

  const classChartData = classSummaries
    .filter((cs) => cs != null)
    .map((cs) => ({
      label: cs!.className || cs!.classId.slice(0, 8),
      value: (cs!.autograde.averageClassScore ?? 0) * 100,
      color: "hsl(var(--primary))",
    }));

  const isLoading = spacesLoading || examsLoading || classesLoading || studentsLoading;

  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Welcome back, {user?.displayName || user?.email || "Teacher"}
          </p>
        </div>
      </FadeIn>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-6" role="status" aria-label="Loading dashboard">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </div>
      )}

      {/* Stats */}
      {!isLoading && (
        <>
          <FadeIn delay={0.1}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <ScoreCard label="Total Students" value={students.length} icon={Users} />
              <ScoreCard label="Active Exams" value={activeExams.length} icon={ClipboardList} />
              <ScoreCard label="Total Spaces" value={spaces.length} icon={BookOpen} />
              <ScoreCard
                label="At-Risk Students"
                value={atRiskCount}
                icon={AlertTriangle}
                trend={atRiskCount > 0 ? "down" : "neutral"}
                trendValue={atRiskCount > 0 ? "Needs attention" : "All good"}
              />
            </div>
          </FadeIn>

          {/* Class Performance Chart + At-Risk Alerts */}
          <FadeIn delay={0.15}>
            <div className="grid gap-6 lg:grid-cols-2">
              {classChartData.length > 0 && (
                <Card>
                  <CardContent className="p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <BarChart3 className="text-muted-foreground h-4 w-4" />
                      <h2 className="font-semibold">Class Performance (Avg Score)</h2>
                    </div>
                    <SimpleBarChart data={classChartData} maxValue={100} height={200} />
                  </CardContent>
                </Card>
              )}

              {atRiskCount > 0 && (
                <Card>
                  <div className="flex items-center justify-between border-b px-5 py-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <h2 className="font-semibold">At-Risk Students</h2>
                    </div>
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400">
                      {atRiskCount} students
                    </span>
                  </div>
                  <div className="max-h-[200px] divide-y overflow-y-auto">
                    {classSummaries
                      .filter((cs) => cs && cs.atRiskCount > 0)
                      .map((cs) => (
                        <div
                          key={cs!.classId}
                          className="flex items-center justify-between px-5 py-3"
                        >
                          <div>
                            <p className="text-sm font-medium">{cs!.className || cs!.classId}</p>
                            <p className="text-muted-foreground text-xs">
                              {cs!.atRiskCount} at-risk student
                              {cs!.atRiskCount !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <AtRiskBadge isAtRisk={true} />
                        </div>
                      ))}
                  </div>
                </Card>
              )}
            </div>
          </FadeIn>

          {/* Class Performance Heatmap */}
          {classChartData.length > 1 && (
            <FadeIn delay={0.2}>
              <Card>
                <CardContent className="p-5">
                  <ClassHeatmap
                    title="Class Performance Overview"
                    cells={classChartData.map((d) => ({
                      label: d.label,
                      value: d.value,
                      sublabel: `Average exam score`,
                    }))}
                    maxValue={100}
                  />
                </CardContent>
              </Card>
            </FadeIn>
          )}

          <FadeIn delay={0.25}>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Spaces */}
              <Card>
                <div className="flex items-center justify-between border-b px-5 py-3">
                  <h2 className="font-semibold">Recent Spaces</h2>
                  <Link
                    to="/spaces"
                    className="text-primary flex items-center gap-1 text-sm hover:underline"
                  >
                    View all <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="divide-y">
                  {spaces.length === 0 && (
                    <EmptyState
                      preset="no-courses"
                      title="No spaces yet"
                      compact
                      action={{
                        label: "Create one",
                        onClick: () => (window.location.href = "/spaces"),
                      }}
                    />
                  )}
                  {spaces.slice(0, 5).map((space: Space) => (
                    <Link
                      key={space.id}
                      to={`/spaces/${space.id}/edit`}
                      className="hover:bg-muted/50 flex items-center justify-between px-5 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{space.title}</p>
                        <p className="text-muted-foreground text-xs capitalize">
                          {space.type} &middot; {space.status}
                        </p>
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {space.stats?.totalStoryPoints ?? 0} story points
                      </span>
                    </Link>
                  ))}
                </div>
              </Card>

              {/* Recent Exams */}
              <Card>
                <div className="flex items-center justify-between border-b px-5 py-3">
                  <h2 className="font-semibold">Recent Exams</h2>
                  <Link
                    to="/exams"
                    className="text-primary flex items-center gap-1 text-sm hover:underline"
                  >
                    View all <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="divide-y">
                  {exams.length === 0 && (
                    <EmptyState
                      preset="no-assignments"
                      title="No exams yet"
                      compact
                      action={{
                        label: "Create one",
                        onClick: () => (window.location.href = "/exams/new"),
                      }}
                    />
                  )}
                  {exams.slice(0, 5).map((exam: Exam) => (
                    <Link
                      key={exam.id}
                      to={`/exams/${exam.id}`}
                      className="hover:bg-muted/50 flex items-center justify-between px-5 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{exam.title}</p>
                        <p className="text-muted-foreground text-xs capitalize">
                          {exam.subject} &middot; {exam.status}
                        </p>
                      </div>
                      <span className="text-muted-foreground text-xs">{exam.totalMarks} marks</span>
                    </Link>
                  ))}
                </div>
              </Card>
            </div>
          </FadeIn>

          {/* Grading Queue */}
          {submissions.length > 0 && (
            <FadeIn delay={0.3}>
              <Card>
                <div className="flex items-center justify-between border-b px-5 py-3">
                  <h2 className="font-semibold">Grading Queue</h2>
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                    {submissions.length} pending
                  </span>
                </div>
                <div className="divide-y">
                  {submissions.slice(0, 5).map((sub: Submission) => (
                    <Link
                      key={sub.id}
                      to={`/exams/${sub.examId}/submissions/${sub.id}`}
                      className="hover:bg-muted/50 flex items-center justify-between px-5 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{sub.studentName}</p>
                        <p className="text-muted-foreground text-xs capitalize">
                          Roll: {sub.rollNumber} &middot; {sub.pipelineStatus}
                        </p>
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {sub.summary?.questionsGraded ?? 0}/{sub.summary?.totalQuestions ?? 0}{" "}
                        graded
                      </span>
                    </Link>
                  ))}
                </div>
              </Card>
            </FadeIn>
          )}
        </>
      )}
    </div>
  );
}
