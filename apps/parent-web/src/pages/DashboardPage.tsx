import { Link } from "react-router-dom";
import {
  useCurrentUser,
  useCurrentMembership,
  useCurrentTenantId,
} from "@levelup/shared-stores";
import { useStudentSummaries } from "@levelup/shared-hooks";
import {
  ScoreCard,
  ProgressRing,
  AtRiskBadge,
  Badge,
  Skeleton,
  FadeIn,
  AnimatedList,
  AnimatedListItem,
  EmptyState,
} from "@levelup/shared-ui";
import type { UserMembership } from "@levelup/shared-types";
import {
  Users,
  ClipboardList,
  BookOpen,
  Flame,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { useLinkedStudents } from "../hooks/useLinkedStudents";
import { useStudentNames } from "../hooks/useStudentNames";
import { getInitials, getStudentDisplayName } from "../lib/helpers";

function DashboardSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DataFreshnessIndicator({
  dataUpdatedAt,
  onRefresh,
}: {
  dataUpdatedAt: number | undefined;
  onRefresh?: () => void;
}) {
  if (!dataUpdatedAt) return null;
  const seconds = Math.floor((Date.now() - dataUpdatedAt) / 1000);
  let timeAgo = "just now";
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      timeAgo = hours >= 24 ? `${Math.floor(hours / 24)}d ago` : `${hours}h ago`;
    } else {
      timeAgo = `${minutes}m ago`;
    }
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-live="polite">
      <span>Updated {timeAgo}</span>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="rounded p-0.5 hover:bg-muted"
          aria-label="Refresh data"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const user = useCurrentUser();
  const membership = useCurrentMembership();
  const tenantId = useCurrentTenantId();
  const { data: linkedStudents, isLoading } = useLinkedStudents(
    tenantId,
    user?.uid ?? null,
  );

  const studentIds = linkedStudents?.map((s) => s.uid) ?? [];
  const summaryResults = useStudentSummaries(tenantId, studentIds);
  const summaries = summaryResults.map((r) => r.data).filter(Boolean);
  const { data: studentNames } = useStudentNames(tenantId, studentIds);

  const atRiskCount = summaries.filter((s) => s?.isAtRisk).length;
  const avgScore =
    summaries.length > 0
      ? summaries.reduce((sum, s) => sum + (s?.overallScore ?? 0), 0) /
        summaries.length
      : 0;

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Parent Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.displayName || user?.email || "Parent"}
            </p>
          </div>
          <DataFreshnessIndicator
            dataUpdatedAt={summaryResults[0]?.dataUpdatedAt}
            onRefresh={() => summaryResults.forEach((r) => r.refetch())}
          />
        </div>
      </FadeIn>

      {/* Overview Cards */}
      <FadeIn delay={0.1}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ScoreCard
          label="Children"
          value={linkedStudents?.length ?? 0}
          icon={Users}
        />
        <ScoreCard
          label="Avg Performance"
          value={summaries.length > 0 ? `${Math.round(avgScore * 100)}%` : "--"}
          icon={TrendingUp}
        />
        <ScoreCard
          label="School"
          value={membership?.tenantCode || "--"}
          icon={BookOpen}
        />
        {atRiskCount > 0 ? (
          <ScoreCard
            label="At-Risk Alerts"
            value={atRiskCount}
            icon={AlertTriangle}
            trend="down"
            trendValue="Needs attention"
          />
        ) : (
          <ScoreCard
            label="Status"
            value="All Good"
            icon={Users}
            trend="up"
            trendValue="Children on track"
          />
        )}
      </div>
      </FadeIn>

      {/* Quick Actions */}
      <FadeIn delay={0.15}>
      <div className="grid gap-3 md:grid-cols-3">
        <Link
          to="/results"
          className="flex items-center gap-3 rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow"
        >
          <ClipboardList className="h-5 w-5 text-info" />
          <div className="flex-1">
            <p className="text-sm font-medium">Exam Results</p>
            <p className="text-xs text-muted-foreground">View released grades</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <Link
          to="/progress"
          className="flex items-center gap-3 rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow"
        >
          <BookOpen className="h-5 w-5 text-success" />
          <div className="flex-1">
            <p className="text-sm font-medium">Space Progress</p>
            <p className="text-xs text-muted-foreground">
              Track learning activity
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <Link
          to="/children"
          className="flex items-center gap-3 rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow"
        >
          <Users className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium">My Children</p>
            <p className="text-xs text-muted-foreground">
              Enrollment details
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>
      </FadeIn>

      {/* Children List with Summaries */}
      <FadeIn delay={0.2}>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Children Overview</h2>
          </div>
          <Link
            to="/children"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {isLoading ? (
          <div role="status" aria-label="Loading content">
            <DashboardSkeleton />
            <span className="sr-only">Loading...</span>
          </div>
        ) : !linkedStudents?.length ? (
          <EmptyState
            icon={Users}
            title="No linked children"
            description="Your children will appear here once they are linked to your account by the school admin."
          />
        ) : (
          <AnimatedList className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {linkedStudents.map((student: UserMembership, idx: number) => {
              const summary = summaries.find(
                (s) => s?.studentId === student.uid,
              );
              const displayName = getStudentDisplayName(studentNames, student, idx);

              return (
                <AnimatedListItem key={student.id}>
                <div
                  className="rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow space-y-3"
                  role="article"
                  aria-label={`${displayName}: ${summary ? `${Math.round(summary.overallScore * 100)}% overall${summary.isAtRisk ? ', at-risk' : ''}` : 'no data yet'}`}
                >
                  {/* Student header */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {getInitials(displayName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{displayName}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={student.status === "active" ? "default" : "secondary"}>
                          {student.status}
                        </Badge>
                        {summary && (
                          <AtRiskBadge
                            isAtRisk={summary.isAtRisk}
                            reasons={summary.atRiskReasons}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Summary data */}
                  {summary ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div role="img" aria-label={`Overall score: ${Math.round(summary.overallScore * 100)}%`}>
                          <ProgressRing
                            value={summary.overallScore * 100}
                            size={60}
                            strokeWidth={6}
                            label="Overall"
                          />
                        </div>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-1">
                            <ClipboardList className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Exams:</span>
                            <span className="font-medium">
                              {Math.round(summary.autograde.averagePercentage)}%
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Spaces:</span>
                            <span className="font-medium">
                              {Math.round(summary.levelup.averageCompletion)}%
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Flame className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Streak:</span>
                            <span className="font-medium">
                              {summary.levelup.streakDays}d
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Recent exam results */}
                      {summary.autograde.recentExams.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Latest Exam Results
                          </p>
                          <div className="space-y-1">
                            {summary.autograde.recentExams.slice(0, 2).map((e) => (
                              <div
                                key={e.examId}
                                className="flex items-center justify-between text-xs"
                              >
                                <span className="truncate max-w-[140px]">
                                  {e.examTitle}
                                </span>
                                <span
                                  className={`font-medium ${
                                    e.percentage >= 70
                                      ? "text-success"
                                      : e.percentage >= 40
                                        ? "text-warning"
                                        : "text-destructive"
                                  }`}
                                >
                                  {Math.round(e.percentage)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No progress data available yet.
                    </p>
                  )}

                  {/* View Details link */}
                  <Link
                    to={`/child-progress?student=${student.uid}`}
                    className="flex items-center gap-1 text-xs text-primary hover:underline pt-1"
                  >
                    View details <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>
                </AnimatedListItem>
              );
            })}
          </AnimatedList>
        )}
      </div>
      </FadeIn>
    </div>
  );
}
