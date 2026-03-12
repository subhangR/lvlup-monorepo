import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCurrentTenantId, useAuthStore } from "@levelup/shared-stores";
import { useExam, useSubmissions } from "@levelup/shared-hooks";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  orderBy,
  updateDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { getFirebaseServices, callGradeQuestion } from "@levelup/shared-services";
import type {
  Submission,
  QuestionSubmission,
  ExamQuestion,
  QuestionGradingStatus,
  SubmissionPipelineStatus,
  FirestoreTimestamp,
} from "@levelup/shared-types";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Save,
  ThumbsUp,
  AlertTriangle,
  Loader2,
  Eye,
  Filter,
  Check,
  RotateCcw,
  Clock,
  History,
  Trophy,
  Star,
  Info,
  Keyboard,
  BookOpen,
} from "lucide-react";
import {
  Button,
  Input,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Skeleton,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@levelup/shared-ui";

export default function GradingReviewPage() {
  const { examId, submissionId } = useParams<{
    examId: string;
    submissionId: string;
  }>();
  const navigate = useNavigate();
  const tenantId = useCurrentTenantId();
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const { data: exam } = useExam(tenantId, examId ?? null);
  const { data: allSubmissions = [] } = useSubmissions(tenantId, { examId });

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [questionSubs, setQuestionSubs] = useState<QuestionSubmission[]>([]);
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<
    Record<string, { score: number; reason: string }>
  >({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [reviewFilter, setReviewFilter] = useState<"all" | "needs_review" | "low_confidence">("all");
  const [showBulkApproveConfirm, setShowBulkApproveConfirm] = useState(false);
  const [showKeyboardHints, setShowKeyboardHints] = useState(false);

  // Next/prev navigation
  const currentIdx = allSubmissions.findIndex((s) => s.id === submissionId);
  const prevSub = currentIdx > 0 ? allSubmissions[currentIdx - 1] : null;
  const nextSub = currentIdx < allSubmissions.length - 1 ? allSubmissions[currentIdx + 1] : null;

  useEffect(() => {
    if (!tenantId || !examId || !submissionId) return;
    const load = async () => {
      setLoading(true);
      const { db } = getFirebaseServices();

      const subDoc = await getDoc(
        doc(db, `tenants/${tenantId}/submissions`, submissionId)
      );
      if (subDoc.exists()) {
        setSubmission({ id: subDoc.id, ...subDoc.data() } as Submission);
      }

      const qSnap = await getDocs(
        query(
          collection(db, `tenants/${tenantId}/exams/${examId}/questions`),
          orderBy("order", "asc")
        )
      );
      setQuestions(
        qSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as ExamQuestion)
      );

      const qsSnap = await getDocs(
        collection(
          db,
          `tenants/${tenantId}/submissions/${submissionId}/questionSubmissions`
        )
      );
      setQuestionSubs(
        qsSnap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as QuestionSubmission
        )
      );
      setLoading(false);
    };
    load();
  }, [tenantId, examId, submissionId]);

  const handleOverride = async (questionSubId: string) => {
    const override = overrides[questionSubId];
    if (!override || !override.reason.trim() || !tenantId || !submissionId || !firebaseUser) return;
    // Validate score bounds
    const qs = questionSubs.find((q) => q.id === questionSubId);
    const question = questions.find((q) => q.id === qs?.questionId);
    const maxMarks = question?.maxMarks ?? 0;
    if (override.score < 0 || override.score > maxMarks) {
      return; // Score out of bounds — input validation prevents this, but double-check
    }
    setSaving(true);
    try {
      const { db } = getFirebaseServices();
      const qs = questionSubs.find((q) => q.id === questionSubId);
      await updateDoc(
        doc(
          db,
          `tenants/${tenantId}/submissions/${submissionId}/questionSubmissions`,
          questionSubId
        ),
        {
          manualOverride: {
            score: override.score,
            reason: override.reason,
            overriddenBy: firebaseUser.uid,
            overriddenAt: serverTimestamp(),
            originalScore: qs?.evaluation?.score ?? 0,
          },
          gradingStatus: "overridden",
          updatedAt: serverTimestamp(),
        }
      );
      setQuestionSubs((prev) =>
        prev.map((q) =>
          q.id === questionSubId
            ? {
                ...q,
                gradingStatus: "overridden" as QuestionGradingStatus,
                manualOverride: {
                  score: override.score,
                  reason: override.reason,
                  overriddenBy: firebaseUser.uid,
                  overriddenAt: serverTimestamp() as unknown as FirestoreTimestamp,
                  originalScore: q.evaluation?.score ?? 0,
                },
              }
            : q
        )
      );
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[questionSubId];
        return next;
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBulkApprove = async () => {
    if (!tenantId || !submissionId || !firebaseUser) return;
    setSaving(true);
    try {
      const { db } = getFirebaseServices();
      const batch = writeBatch(db);

      for (const qs of questionSubs) {
        if (qs.gradingStatus === "graded") {
          batch.update(
            doc(
              db,
              `tenants/${tenantId}/submissions/${submissionId}/questionSubmissions`,
              qs.id
            ),
            { gradingStatus: "manual", updatedAt: serverTimestamp() }
          );
        }
      }

      batch.update(
        doc(db, `tenants/${tenantId}/submissions`, submissionId),
        { pipelineStatus: "reviewed", updatedAt: serverTimestamp() }
      );

      await batch.commit();

      setSubmission((prev) =>
        prev ? { ...prev, pipelineStatus: "reviewed" as SubmissionPipelineStatus } : null
      );
      setQuestionSubs((prev) =>
        prev.map((q) =>
          q.gradingStatus === "graded"
            ? { ...q, gradingStatus: "manual" as QuestionGradingStatus }
            : q
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAcceptGrade = useCallback(async (questionSubId: string) => {
    if (!tenantId || !submissionId || !firebaseUser) return;
    setSaving(true);
    try {
      const { db } = getFirebaseServices();
      await updateDoc(
        doc(
          db,
          `tenants/${tenantId}/submissions/${submissionId}/questionSubmissions`,
          questionSubId
        ),
        { gradingStatus: "manual", reviewSuggested: false, updatedAt: serverTimestamp() }
      );
      setQuestionSubs((prev) =>
        prev.map((q) =>
          q.id === questionSubId
            ? { ...q, gradingStatus: "manual" as QuestionGradingStatus }
            : q
        )
      );
    } finally {
      setSaving(false);
    }
  }, [tenantId, submissionId, firebaseUser]);

  const handleRetryGrading = async (questionSubId: string) => {
    if (!tenantId || !submissionId || !examId) return;
    setSaving(true);
    try {
      await callGradeQuestion({
        tenantId,
        submissionId,
        examId,
        questionIds: [questionSubId],
        mode: 'retry',
      });
      // Reload question submissions to reflect updated state
      const { db } = getFirebaseServices();
      const qsSnap = await getDocs(
        collection(db, `tenants/${tenantId}/submissions/${submissionId}/questionSubmissions`)
      );
      setQuestionSubs(
        qsSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as QuestionSubmission)
      );
    } finally {
      setSaving(false);
    }
  };

  // Filter and sort questions based on review filter — prioritize review-needing items
  const filteredQuestions = questions
    .filter((q) => {
      if (reviewFilter === "all") return true;
      const qs = questionSubs.find((s) => s.questionId === q.id);
      if (!qs) return false;
      if (reviewFilter === "needs_review") {
        return qs.gradingStatus === "needs_review" || (qs as QuestionSubmission & { reviewSuggested?: boolean }).reviewSuggested;
      }
      if (reviewFilter === "low_confidence") {
        return qs.evaluation?.confidence != null && qs.evaluation.confidence < 0.7;
      }
      return true;
    })
    .sort((a, b) => {
      const qsA = questionSubs.find((s) => s.questionId === a.id);
      const qsB = questionSubs.find((s) => s.questionId === b.id);
      // Needs review first
      const aReview = qsA?.gradingStatus === "needs_review" || (qsA as QuestionSubmission & { reviewSuggested?: boolean })?.reviewSuggested ? 1 : 0;
      const bReview = qsB?.gradingStatus === "needs_review" || (qsB as QuestionSubmission & { reviewSuggested?: boolean })?.reviewSuggested ? 1 : 0;
      if (aReview !== bReview) return bReview - aReview;
      // Then by confidence (low first)
      const confA = qsA?.evaluation?.confidence ?? 1;
      const confB = qsB?.evaluation?.confidence ?? 1;
      return confA - confB;
    });

  // Count questions needing review
  const needsReviewCount = questionSubs.filter(
    (qs) => qs.gradingStatus === "needs_review" || (qs as QuestionSubmission & { reviewSuggested?: boolean }).reviewSuggested
  ).length;

  // Keyboard navigation (Task 5.1)
  const handleKeyNav = useCallback(
    (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const currentIdx = filteredQuestions.findIndex((q) => q.id === expandedQ);

      switch (e.key) {
        case "j":
        case "ArrowDown": {
          e.preventDefault();
          const nextIdx = currentIdx < filteredQuestions.length - 1 ? currentIdx + 1 : 0;
          setExpandedQ(filteredQuestions[nextIdx]?.id ?? null);
          break;
        }
        case "k":
        case "ArrowUp": {
          e.preventDefault();
          const prevIdx = currentIdx > 0 ? currentIdx - 1 : filteredQuestions.length - 1;
          setExpandedQ(filteredQuestions[prevIdx]?.id ?? null);
          break;
        }
        case "Enter": {
          e.preventDefault();
          if (expandedQ) {
            setExpandedQ(null);
          } else if (filteredQuestions.length > 0) {
            setExpandedQ(filteredQuestions[0].id);
          }
          break;
        }
        case "a": {
          // Accept AI grade for current question
          if (!expandedQ) return;
          const qs = questionSubs.find((s) => s.questionId === expandedQ);
          if (qs && (qs.gradingStatus === "needs_review" || qs.gradingStatus === "graded") && !qs.manualOverride && qs.evaluation) {
            handleAcceptGrade(qs.id);
          }
          break;
        }
        case "o": {
          // Focus override input for current question
          if (!expandedQ) return;
          const overrideInput = document.querySelector<HTMLInputElement>(
            `[data-override-input="${expandedQ}"]`
          );
          if (overrideInput) overrideInput.focus();
          break;
        }
        case "?": {
          setShowKeyboardHints((prev) => !prev);
          break;
        }
      }
    },
    [expandedQ, filteredQuestions, questionSubs, handleAcceptGrade],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyNav);
    return () => window.removeEventListener("keydown", handleKeyNav);
  }, [handleKeyNav]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-center py-24">
        <p className="text-muted-foreground">Submission not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to="/exams">Exams</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/exams/${examId}`}>{exam?.title ?? "Exam"}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/exams/${examId}/submissions`}>Submissions</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{submission.studentName ?? "Review"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/exams/${examId}/submissions`)} aria-label="Go back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold truncate">
              Grading Review — {submission.studentName}
            </h1>
            <p className="text-sm text-muted-foreground">
              Roll: {submission.rollNumber} &middot; Pipeline:{" "}
              {submission.pipelineStatus.replace(/_/g, " ")}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Next/Prev Navigation (Phase 3.2) */}
          <Button
            variant="outline"
            size="sm"
            disabled={!prevSub}
            onClick={() => prevSub && navigate(`/exams/${examId}/submissions/${prevSub.id}`)}
          >
            <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Previous</span>
          </Button>
          {allSubmissions.length > 0 && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {currentIdx + 1} of {allSubmissions.length}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            disabled={!nextSub}
            onClick={() => nextSub && navigate(`/exams/${examId}/submissions/${nextSub.id}`)}
          >
            <span className="hidden sm:inline">Next</span> <ChevronRight className="h-4 w-4" />
          </Button>
          {submission.pipelineStatus !== "reviewed" && (
            <Button
              onClick={() => setShowBulkApproveConfirm(true)}
              disabled={saving}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ThumbsUp className="h-3.5 w-3.5" />
              )}
              Approve All
            </Button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              {submission.summary?.totalScore ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">
              / {submission.summary?.maxScore ?? exam?.totalMarks ?? 0} Score
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              {submission.summary?.percentage != null
                ? `${Math.round(submission.summary.percentage)}%`
                : "-"}
            </p>
            <p className="text-xs text-muted-foreground">Percentage</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              {submission.summary?.grade || "-"}
            </p>
            <p className="text-xs text-muted-foreground">Grade</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              {submission.summary?.questionsGraded ?? 0}/
              {submission.summary?.totalQuestions ?? questions.length}
            </p>
            <p className="text-xs text-muted-foreground">Questions Graded</p>
          </CardContent>
        </Card>
      </div>

      {/* High Score Celebration (Task 4.4) */}
      {submission.summary?.percentage != null && submission.summary.percentage >= 90 && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 p-4">
          <Trophy className="h-6 w-6 text-amber-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Outstanding Performance!
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              {submission.studentName} scored {Math.round(submission.summary.percentage)}% — {submission.summary.grade} grade
            </p>
          </div>
          <Star className="h-5 w-5 text-amber-400" />
        </div>
      )}

      {/* Per-Question Review */}
      <div className="space-y-3">
        {/* Keyboard shortcuts hint */}
        {showKeyboardHints && (
          <div className="rounded-lg border bg-muted/50 p-3 text-xs space-y-1">
            <div className="flex items-center gap-2 font-medium"><Keyboard className="h-3.5 w-3.5" /> Keyboard Shortcuts</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-0.5 text-muted-foreground">
              <span><kbd className="rounded border px-1 font-mono text-[10px]">j</kbd> / <kbd className="rounded border px-1 font-mono text-[10px]">↓</kbd> Next question</span>
              <span><kbd className="rounded border px-1 font-mono text-[10px]">k</kbd> / <kbd className="rounded border px-1 font-mono text-[10px]">↑</kbd> Previous question</span>
              <span><kbd className="rounded border px-1 font-mono text-[10px]">Enter</kbd> Expand/collapse</span>
              <span><kbd className="rounded border px-1 font-mono text-[10px]">a</kbd> Accept AI grade</span>
              <span><kbd className="rounded border px-1 font-mono text-[10px]">o</kbd> Focus override input</span>
              <span><kbd className="rounded border px-1 font-mono text-[10px]">?</kbd> Toggle this help</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Per-Question Review</h2>
            <button
              onClick={() => setShowKeyboardHints((prev) => !prev)}
              className="text-muted-foreground hover:text-foreground"
              title="Keyboard shortcuts (?)"
            >
              <Keyboard className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {needsReviewCount > 0 && (
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                {needsReviewCount} need{needsReviewCount === 1 ? "s" : ""} review
              </span>
            )}
            <div className="flex items-center rounded-lg border p-0.5 gap-0.5">
              <button
                onClick={() => setReviewFilter("all")}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors ${reviewFilter === "all" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              >
                All ({questions.length})
              </button>
              <button
                onClick={() => setReviewFilter("needs_review")}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors flex items-center gap-1 ${reviewFilter === "needs_review" ? "bg-amber-500 text-white" : "hover:bg-muted"}`}
              >
                <Eye className="h-3 w-3" /> Review
              </button>
              <button
                onClick={() => setReviewFilter("low_confidence")}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors flex items-center gap-1 ${reviewFilter === "low_confidence" ? "bg-red-500 text-white" : "hover:bg-muted"}`}
              >
                <Filter className="h-3 w-3" /> Low Confidence
              </button>
            </div>
          </div>
        </div>
        {filteredQuestions.length === 0 && reviewFilter !== "all" && (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No questions match the selected filter.
            </p>
          </div>
        )}
        {filteredQuestions.map((q) => {
          const qs = questionSubs.find((s) => s.questionId === q.id);
          const isExpanded = expandedQ === q.id;
          const eval_ = qs?.evaluation;
          const override = overrides[qs?.id ?? ""];
          const confidence = eval_?.confidence;
          const isReviewSuggested = (qs as QuestionSubmission & { reviewSuggested?: boolean })?.reviewSuggested;

          return (
            <Card key={q.id}>
              <button
                onClick={() =>
                  setExpandedQ((prev) => (prev === q.id ? null : q.id))
                }
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
                aria-label="Toggle details"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="text-sm font-bold text-muted-foreground">
                  Q{q.order}
                </span>
                <span className="flex-1 text-sm truncate">{q.text}</span>
                <div className="flex items-center gap-2">
                  {/* Confidence badge */}
                  {confidence != null && (
                    <span
                      className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                        confidence >= 0.9
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : confidence >= 0.7
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {Math.round(confidence * 100)}%
                    </span>
                  )}
                  {/* Status icon */}
                  {qs?.gradingStatus === "graded" && !isReviewSuggested && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  {qs?.gradingStatus === "graded" && isReviewSuggested && (
                    <Eye className="h-4 w-4 text-amber-500" />
                  )}
                  {qs?.gradingStatus === "needs_review" && (
                    <Eye className="h-4 w-4 text-amber-500" />
                  )}
                  {qs?.gradingStatus === "failed" && (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  {qs?.gradingStatus === "overridden" && (
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  )}
                  {qs?.gradingStatus === "manual" && (
                    <Check className="h-4 w-4 text-blue-500" />
                  )}
                  <span className="text-sm font-semibold">
                    {qs?.manualOverride
                      ? qs.manualOverride.score
                      : eval_?.score ?? "-"}
                    /{q.maxMarks}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 space-y-4">
                  {/* Original Question Text (Task 1.3) */}
                  <details className="rounded border bg-muted/30 group">
                    <summary className="flex items-center gap-2 cursor-pointer px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">
                      <BookOpen className="h-3.5 w-3.5" />
                      Question — {q.maxMarks} marks
                      {q.rubric?.criteria && (
                        <span className="ml-auto text-[10px]">{q.rubric.criteria.length} criteria</span>
                      )}
                    </summary>
                    <div className="px-3 pb-3 space-y-2">
                      <p className="text-sm">{q.text}</p>
                      {q.rubric?.criteria && q.rubric.criteria.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Rubric Criteria</p>
                          {q.rubric.criteria.map((c, ci) => (
                            <div key={ci} className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{c.name}</span>
                              <span className="font-medium">{c.maxPoints} pts</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </details>

                  {/* Side-by-side layout: Answer image on left, AI evaluation on right (Task 4.2) */}
                  <div className="grid gap-4 lg:grid-cols-2">
                    {/* LEFT: Student Answer Images */}
                    <div className="space-y-3">
                      {qs?.mapping?.imageUrls && qs.mapping.imageUrls.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">
                            Student Answer
                          </p>
                          <div className="space-y-2">
                            {qs.mapping.imageUrls.map((url, idx) => (
                              <img
                                key={idx}
                                src={url}
                                alt={`Answer page ${idx + 1}`}
                                loading="lazy"
                                decoding="async"
                                className="w-full rounded border object-contain cursor-pointer hover:ring-2 hover:ring-primary"
                                onClick={() => setLightboxUrl(url)}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Grading error context (Task 3.1) */}
                      {qs && (qs as QuestionSubmission & { gradingError?: string }).gradingError && (
                        <div className="rounded border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 p-3 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Info className="h-3.5 w-3.5 text-red-500" />
                            <p className="text-xs font-medium text-red-700 dark:text-red-400">Grading Error</p>
                          </div>
                          <p className="text-xs text-red-600 dark:text-red-400">
                            {(qs as QuestionSubmission & { gradingError?: string }).gradingError}
                          </p>
                          {(qs.gradingRetryCount ?? 0) > 0 && (
                            <p className="text-[10px] text-red-500/70">
                              {(qs.gradingRetryCount ?? 0) >= 3
                                ? `Retry limit reached (${qs.gradingRetryCount} attempts)`
                                : `Retried ${qs.gradingRetryCount} time${qs.gradingRetryCount === 1 ? '' : 's'}`}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* RIGHT: AI Evaluation */}
                    <div className="space-y-3">
                      {eval_ && (
                        <>
                          {/* Score + Confidence visual (Task 4.3) */}
                          <div className="rounded border p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">Score</p>
                                <p className="text-lg font-bold">{eval_.score}/{eval_.maxScore}</p>
                              </div>
                              {eval_.mistakeClassification && eval_.mistakeClassification !== 'None' && (
                                <span className="text-xs rounded-full border px-2 py-0.5">
                                  {eval_.mistakeClassification}
                                </span>
                              )}
                            </div>
                            {/* Confidence bar with color coding */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] text-muted-foreground">
                                  AI Confidence
                                </span>
                                <span className={`text-[10px] font-medium ${
                                  confidence != null && confidence >= 0.9
                                    ? "text-green-600 dark:text-green-400"
                                    : confidence != null && confidence >= 0.7
                                      ? "text-amber-600 dark:text-amber-400"
                                      : "text-red-600 dark:text-red-400"
                                }`}>
                                  {confidence != null ? (
                                    confidence >= 0.9
                                      ? "High Confidence"
                                      : confidence >= 0.7
                                        ? "Medium — Review Suggested"
                                        : "Low — Review Recommended"
                                  ) : "Unknown"}
                                </span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    confidence != null && confidence >= 0.9
                                      ? "bg-green-500"
                                      : confidence != null && confidence >= 0.7
                                        ? "bg-amber-500"
                                        : "bg-red-500"
                                  }`}
                                  style={{ width: `${Math.round((confidence ?? 0) * 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Strengths & Weaknesses */}
                          <div className="grid gap-3 sm:grid-cols-2">
                            {eval_.strengths.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
                                  Strengths
                                </p>
                                <ul className="space-y-1">
                                  {eval_.strengths.map((s, idx) => (
                                    <li key={idx} className="text-xs text-muted-foreground">
                                      + {s}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {eval_.weaknesses.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">
                                  Weaknesses
                                </p>
                                <ul className="space-y-1">
                                  {eval_.weaknesses.map((w, idx) => (
                                    <li key={idx} className="text-xs text-muted-foreground">
                                      - {w}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Rubric breakdown */}
                          {eval_.rubricBreakdown &&
                            eval_.rubricBreakdown.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-2">
                                  Rubric Breakdown
                                </p>
                                <div className="space-y-1">
                                  {eval_.rubricBreakdown.map((rb, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between text-xs"
                                    >
                                      <span>{rb.criterion}</span>
                                      <span className="font-medium">
                                        {rb.awarded}/{rb.max}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          {/* Summary */}
                          {eval_.summary && (
                            <div className="rounded bg-muted p-3">
                              <p className="text-xs font-medium mb-1">
                                {eval_.summary.keyTakeaway}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {eval_.summary.overallComment}
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Override Audit Trail Timeline (Task 3.2) */}
                  {qs?.manualOverride && (
                    <div className="rounded bg-orange-50 dark:bg-orange-950/30 p-3 space-y-3">
                      <div className="flex items-center gap-2">
                        <History className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                        <p className="text-xs font-medium text-orange-700 dark:text-orange-400">
                          Override Audit Trail
                        </p>
                      </div>
                      {/* Timeline */}
                      <div className="relative pl-4 border-l-2 border-orange-200 dark:border-orange-800 space-y-3">
                        {/* Step 1: AI Grading */}
                        <div className="relative">
                          <div className="absolute -left-[1.3rem] top-0.5 h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                          <p className="text-[10px] font-medium text-muted-foreground">AI Graded</p>
                          <p className="text-xs">
                            Score: <span className="font-medium">{qs.manualOverride.originalScore}/{q.maxMarks}</span>
                            {eval_?.confidence != null && (
                              <span className="text-muted-foreground"> (Confidence: {Math.round(eval_.confidence * 100)}%)</span>
                            )}
                          </p>
                          {eval_?.gradedAt && (
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5" />
                              {typeof eval_.gradedAt === 'object' && 'toDate' in eval_.gradedAt
                                ? (eval_.gradedAt as { toDate: () => Date }).toDate().toLocaleString()
                                : 'AI grading completed'}
                            </p>
                          )}
                        </div>
                        {/* Step 2: Manual Override */}
                        <div className="relative">
                          <div className="absolute -left-[1.3rem] top-0.5 h-2.5 w-2.5 rounded-full bg-orange-500" />
                          <p className="text-[10px] font-medium text-orange-700 dark:text-orange-400">Override Applied</p>
                          <p className="text-xs">
                            Score changed: <span className="line-through">{qs.manualOverride.originalScore}</span> → <span className="font-semibold">{qs.manualOverride.score}/{q.maxMarks}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">Reason: {qs.manualOverride.reason}</p>
                          {qs.manualOverride.overriddenAt && (
                            <p className="text-[10px] text-orange-500/70 flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5" />
                              {typeof qs.manualOverride.overriddenAt === 'object' && 'toDate' in qs.manualOverride.overriddenAt
                                ? (qs.manualOverride.overriddenAt as { toDate: () => Date }).toDate().toLocaleString()
                                : 'Recently'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Retry button for failed questions (Task 3.1) */}
                    {qs && (qs.gradingStatus === "failed" || qs.gradingStatus === "needs_review") && !qs.manualOverride && (
                      <Button
                        onClick={() => handleRetryGrading(qs.id)}
                        disabled={saving || (qs.gradingRetryCount ?? 0) >= 3}
                        size="sm"
                        variant="outline"
                        className="gap-1.5 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                      >
                        <RotateCcw className="h-3 w-3" />
                        {saving ? "Retrying..." : (qs.gradingRetryCount ?? 0) >= 3 ? "Retry Limit Reached" : "Retry AI Grading"}
                      </Button>
                    )}

                    {/* Accept AI Grade button */}
                    {qs && (qs.gradingStatus === "needs_review" || qs.gradingStatus === "graded") && !qs.manualOverride && qs.evaluation && (
                      <Button
                        onClick={() => handleAcceptGrade(qs.id)}
                        disabled={saving}
                        size="sm"
                        variant="outline"
                        className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
                      >
                        <Check className="h-3 w-3" /> Accept AI Grade ({eval_?.score}/{q.maxMarks})
                      </Button>
                    )}
                  </div>

                  {/* Override form */}
                  {qs && !qs.manualOverride && (
                    <div className="rounded border p-3 space-y-2">
                      <p className="text-xs font-medium">Manual Override</p>
                      <div className="flex items-center gap-2">
                        <Input
                          data-override-input={q.id}
                          type="number"
                          value={override?.score ?? eval_?.score ?? 0}
                          onChange={(e) =>
                            setOverrides((prev) => ({
                              ...prev,
                              [qs.id]: {
                                ...prev[qs.id],
                                score: Number(e.target.value),
                                reason: prev[qs.id]?.reason ?? "",
                              },
                            }))
                          }
                          min={0}
                          max={q.maxMarks}
                          className="h-8 w-20"
                        />
                        <span className="text-xs text-muted-foreground">
                          / {q.maxMarks}
                        </span>
                        <Input
                          type="text"
                          value={override?.reason ?? ""}
                          onChange={(e) =>
                            setOverrides((prev) => ({
                              ...prev,
                              [qs.id]: {
                                ...prev[qs.id],
                                score: prev[qs.id]?.score ?? eval_?.score ?? 0,
                                reason: e.target.value,
                              },
                            }))
                          }
                          placeholder="Reason for override (required)"
                          className="h-8 flex-1"
                        />
                        <Button
                          onClick={() => handleOverride(qs.id)}
                          disabled={
                            saving ||
                            !override?.reason?.trim()
                          }
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          <Save className="h-3 w-3" /> Override
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Image Lightbox Dialog (Phase 3.1) */}
      <Dialog open={!!lightboxUrl} onOpenChange={() => setLightboxUrl(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-2">
          <DialogTitle className="sr-only">Answer Image</DialogTitle>
          {lightboxUrl && (
            <img src={lightboxUrl} alt="Full answer" loading="eager" decoding="async" className="w-full h-full object-contain" />
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Approve Confirmation Dialog */}
      <AlertDialog open={showBulkApproveConfirm} onOpenChange={setShowBulkApproveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve All AI Grades?</AlertDialogTitle>
            <AlertDialogDescription>
              This will accept all AI-graded answers for this submission.
              {needsReviewCount > 0 && (
                <span className="block mt-2 font-medium text-amber-600 dark:text-amber-400">
                  {needsReviewCount} question{needsReviewCount === 1 ? '' : 's'} still need{needsReviewCount === 1 ? 's' : ''} review.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { setShowBulkApproveConfirm(false); handleBulkApprove(); }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Approve All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
