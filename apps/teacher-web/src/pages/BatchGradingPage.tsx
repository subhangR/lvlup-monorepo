import { useState, useMemo, useCallback } from "react";
import { useAuthStore } from "@levelup/shared-stores";
import { useSubmissions, useExams, useGradeQuestion } from "@levelup/shared-hooks";
import {
  Button,
  Card,
  CardContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Skeleton,
  EmptyState,
  FadeIn,
  AnimatedList,
  AnimatedListItem,
  Badge,
} from "@levelup/shared-ui";
import type { Submission } from "@levelup/shared-types";
import {
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { sonnerToast as toast } from "@levelup/shared-ui";

type GradingFilter = "all" | "needs_review" | "auto_graded" | "flagged";

const FILTER_OPTIONS: { value: GradingFilter; label: string }[] = [
  { value: "all", label: "All Pending" },
  { value: "needs_review", label: "Needs Review" },
  { value: "auto_graded", label: "Auto-Graded" },
  { value: "flagged", label: "Flagged" },
];

const PAGE_SIZE = 10;

function getStatusBadge(status: string) {
  switch (status) {
    case "grading_complete":
      return (
        <Badge variant="outline" className="border-amber-300 text-amber-600">
          Auto-Graded
        </Badge>
      );
    case "needs_review":
      return (
        <Badge variant="outline" className="border-blue-300 text-blue-600">
          Needs Review
        </Badge>
      );
    case "flagged":
      return <Badge variant="destructive">Flagged</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function BatchGradingPage() {
  const { currentTenantId } = useAuthStore();
  const tenantId = currentTenantId;

  const { data: submissions, isLoading: subsLoading } = useSubmissions(tenantId);
  const { data: exams } = useExams(tenantId);
  const gradeQuestion = useGradeQuestion();

  const [filter, setFilter] = useState<GradingFilter>("all");
  const [examFilter, setExamFilter] = useState<string>("all");
  const [page, setPage] = useState(0);

  // Pending submissions (not yet reviewed/released)
  const pendingSubmissions = useMemo(() => {
    const pending = (submissions ?? []).filter(
      (s) =>
        s.status === "grading_complete" ||
        s.status === "needs_review" ||
        s.status === "flagged" ||
        s.status === "submitted"
    );

    let filtered = pending;
    if (filter !== "all") {
      filtered = filtered.filter((s) => {
        if (filter === "auto_graded") return s.status === "grading_complete";
        if (filter === "needs_review")
          return s.status === "needs_review" || s.status === "submitted";
        if (filter === "flagged") return s.status === "flagged";
        return true;
      });
    }

    if (examFilter !== "all") {
      filtered = filtered.filter((s) => s.examId === examFilter);
    }

    return filtered;
  }, [submissions, filter, examFilter]);

  const totalPages = Math.ceil(pendingSubmissions.length / PAGE_SIZE);
  const currentPageItems = pendingSubmissions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const getExamTitle = useCallback(
    (examId: string) => exams?.find((e) => e.id === examId)?.title ?? examId,
    [exams]
  );

  const handleApprove = useCallback(
    (sub: Submission) => {
      if (!tenantId) return;
      // Mark as reviewed by calling grade with existing scores
      gradeQuestion.mutate(
        {
          tenantId,
          submissionId: sub.id,
          status: "reviewed",
        },
        {
          onSuccess: () => toast.success("Submission approved"),
          onError: () => toast.error("Failed to approve submission"),
        }
      );
    },
    [tenantId, gradeQuestion]
  );

  const uniqueExams = useMemo(() => {
    const examIds = new Set((submissions ?? []).map((s) => s.examId));
    return (exams ?? []).filter((e) => examIds.has(e.id));
  }, [submissions, exams]);

  const reviewed = (submissions ?? []).filter(
    (s) => s.status === "reviewed" || s.status === "released"
  ).length;

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center gap-3">
          <CheckSquare className="text-primary h-6 w-6" aria-hidden="true" />
          <div>
            <h1 className="text-2xl font-bold">Batch Grading</h1>
            <p className="text-muted-foreground text-sm">Review and approve pending submissions</p>
          </div>
        </div>
      </FadeIn>

      {/* Progress indicator */}
      <FadeIn delay={0.05}>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            <strong className="text-foreground">{pendingSubmissions.length}</strong> pending
          </span>
          <span className="text-muted-foreground">
            <strong className="text-foreground">{reviewed}</strong> reviewed
          </span>
          {pendingSubmissions.length > 0 && (
            <span className="text-muted-foreground">
              Page {page + 1} of {totalPages}
            </span>
          )}
        </div>
      </FadeIn>

      {/* Filters */}
      <FadeIn delay={0.1}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="text-muted-foreground h-4 w-4" aria-hidden="true" />
            <Select
              value={filter}
              onValueChange={(v) => {
                setFilter(v as GradingFilter);
                setPage(0);
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Select
            value={examFilter}
            onValueChange={(v) => {
              setExamFilter(v);
              setPage(0);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Exams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exams</SelectItem>
              {uniqueExams.map((exam) => (
                <SelectItem key={exam.id} value={exam.id}>
                  {exam.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FadeIn>

      {/* Submission List */}
      {subsLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      ) : currentPageItems.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No submissions to review"
          description="All pending submissions have been reviewed. Great job!"
        />
      ) : (
        <AnimatedList className="space-y-2">
          {currentPageItems.map((sub) => (
            <AnimatedListItem key={sub.id}>
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium">
                        {sub.studentName ?? sub.studentId}
                      </p>
                      {getStatusBadge(sub.status)}
                    </div>
                    <div className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
                      <span>{getExamTitle(sub.examId)}</span>
                      {sub.totalScore !== undefined && (
                        <span className="font-medium">
                          Score: {sub.totalScore}/{sub.totalMarks ?? "?"}
                        </span>
                      )}
                      {sub.createdAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {new Date(sub.createdAt.toDate?.() ?? sub.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs"
                      onClick={() => handleApprove(sub)}
                      disabled={gradeQuestion.isPending}
                    >
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                      Approve
                    </Button>
                    {sub.status === "flagged" && (
                      <span className="text-destructive" aria-label="Flagged for review">
                        <AlertTriangle className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </AnimatedListItem>
          ))}
        </AnimatedList>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-muted-foreground text-sm">
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
