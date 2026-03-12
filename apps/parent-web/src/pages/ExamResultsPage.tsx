import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCurrentUser, useCurrentTenantId } from "@levelup/shared-stores";
import {
  Input,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  DownloadPDFButton,
  Skeleton,
  EmptyState,
} from "@levelup/shared-ui";
import { callGenerateReport } from "@levelup/shared-services";
import type { QuestionSubmission } from "@levelup/shared-types";
import {
  Search,
  ClipboardList,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import { useLinkedStudentIds } from "../hooks/useLinkedStudents";
import { useChildSubmissions } from "../hooks/useChildSubmissions";
import { useQuestionSubmissions } from "../hooks/useQuestionSubmissions";

function QuestionFeedbackSection({
  tenantId,
  submissionId,
}: {
  tenantId: string;
  submissionId: string;
}) {
  const { data: questions, isLoading } = useQuestionSubmissions(tenantId, submissionId);

  if (isLoading) {
    return (
      <div className="py-3 text-center text-sm text-muted-foreground">
        Loading question details...
      </div>
    );
  }

  if (!questions?.length) {
    return (
      <p className="py-3 text-center text-sm text-muted-foreground">
        No per-question feedback available yet.
      </p>
    );
  }

  const sorted = [...questions].sort((a: QuestionSubmission, b: QuestionSubmission) =>
    a.questionId.localeCompare(b.questionId, undefined, { numeric: true }),
  );

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">Per-Question Breakdown</h4>
      {sorted.map((qs, idx) => {
        const ev = qs.evaluation;
        const pct = ev ? Math.round(ev.percentage) : null;
        const statusColor =
          pct === null
            ? "text-muted-foreground"
            : pct >= 70
              ? "text-success"
              : pct >= 40
                ? "text-warning"
                : "text-destructive";
        const statusIcon =
          pct === null ? (
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          ) : pct >= 70 ? (
            <CheckCircle2 className="h-4 w-4 text-success" />
          ) : (
            <XCircle className="h-4 w-4 text-destructive" />
          );

        return (
          <div key={qs.id} className="rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {statusIcon}
                <span className="text-sm font-medium">
                  Question {idx + 1}
                </span>
                {qs.gradingStatus !== "graded" && (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-xs capitalize text-muted-foreground">
                    {qs.gradingStatus.replace(/_/g, " ")}
                  </span>
                )}
              </div>
              {ev && (
                <span className={`text-sm font-bold ${statusColor}`}>
                  {ev.score}/{ev.maxScore}
                </span>
              )}
            </div>

            {ev && (
              <div className="mt-2 space-y-2">
                {/* Score bar */}
                <div
                  className="h-1.5 w-full rounded-full bg-muted"
                  role="progressbar"
                  aria-valuenow={pct!}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Score: ${pct}%`}
                >
                  <div
                    className={`h-1.5 rounded-full ${
                      pct! >= 70
                        ? "bg-success"
                        : pct! >= 40
                          ? "bg-warning"
                          : "bg-destructive"
                    }`}
                    style={{ width: `${Math.min(100, pct!)}%` }}
                  />
                </div>

                {/* Summary comment */}
                {ev.summary?.overallComment && (
                  <p className="text-sm text-muted-foreground">
                    {ev.summary.overallComment}
                  </p>
                )}

                {/* Rubric breakdown */}
                {ev.rubricBreakdown && ev.rubricBreakdown.length > 0 && (
                  <div className="space-y-1">
                    {ev.rubricBreakdown.map((rb, rIdx) => (
                      <div
                        key={rIdx}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-muted-foreground">
                          {rb.criterion}
                        </span>
                        <span className="font-medium">
                          {rb.awarded}/{rb.max}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Strengths & Weaknesses */}
                {(ev.strengths?.length > 0 || ev.weaknesses?.length > 0) && (
                  <div className="grid gap-2 text-xs sm:grid-cols-2">
                    {ev.strengths?.length > 0 && (
                      <div>
                        <p className="font-medium text-success">Strengths:</p>
                        <ul className="mt-0.5 space-y-0.5 text-muted-foreground">
                          {ev.strengths.map((s, si) => (
                            <li key={si}>- {s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {ev.weaknesses?.length > 0 && (
                      <div>
                        <p className="font-medium text-warning">
                          Areas to improve:
                        </p>
                        <ul className="mt-0.5 space-y-0.5 text-muted-foreground">
                          {ev.weaknesses.map((w, wi) => (
                            <li key={wi}>- {w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Mistake classification */}
                {ev.mistakeClassification && ev.mistakeClassification !== "None" && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Lightbulb className="h-3 w-3" />
                    Mistake type: {ev.mistakeClassification}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ExamResultsSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="Loading content">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-24 rounded-lg" />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default function ExamResultsPage() {
  const user = useCurrentUser();
  const tenantId = useCurrentTenantId();
  const [searchParams] = useSearchParams();
  const studentFromUrl = searchParams.get("student");
  const { data: studentIds } = useLinkedStudentIds(tenantId, user?.uid ?? null);
  const { data: submissions, isLoading } = useChildSubmissions(
    tenantId,
    studentIds,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = submissions?.filter((sub) => {
    if (studentFromUrl && sub.studentId !== studentFromUrl) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      sub.studentName?.toLowerCase().includes(q) ||
      sub.rollNumber?.toLowerCase().includes(q) ||
      sub.examTitle?.toLowerCase().includes(q) ||
      sub.examSubject?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Exam Results</h1>
        <p className="text-sm text-muted-foreground">
          View your children's released exam results
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by student name, exam, or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <ExamResultsSkeleton />
      ) : !filtered?.length ? (
        <EmptyState
          icon={ClipboardList}
          title="No results available"
          description="Results will appear here once teachers release them"
        />
      ) : (
        <Accordion type="single" collapsible className="space-y-3">
          {filtered.map((sub) => (
            <AccordionItem
              key={sub.id}
              value={sub.id}
              className="rounded-lg border bg-card hover:shadow-sm transition-shadow"
            >
              <AccordionTrigger className="flex w-full items-center justify-between p-4 hover:no-underline">
                <div className="flex items-center gap-3 flex-1 min-w-0 text-left">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold truncate">
                        {sub.examTitle || `Exam ${sub.examId.slice(0, 8)}`}
                      </span>
                      {sub.examSubject && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground flex-shrink-0">
                          {sub.examSubject}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground block">
                      {sub.studentName || "Student"} | Roll: {sub.rollNumber || "--"}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p
                    className={`text-2xl font-bold ${
                      (sub.summary?.percentage ?? 0) >= 70
                        ? "text-success"
                        : (sub.summary?.percentage ?? 0) >= 40
                          ? "text-warning"
                          : "text-destructive"
                    }`}
                  >
                    {sub.summary?.percentage != null
                      ? `${Math.round(sub.summary.percentage)}%`
                      : "--"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {sub.summary?.totalScore ?? 0}/{sub.summary?.maxScore ?? 0}
                  </p>
                </div>
              </AccordionTrigger>

              {/* Score bar */}
              {sub.summary?.percentage != null && (
                <div className="px-4 pb-2">
                  <div
                    className="h-1.5 w-full rounded-full bg-muted"
                    role="progressbar"
                    aria-valuenow={Math.round(sub.summary.percentage)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Score: ${Math.round(sub.summary.percentage)}%`}
                  >
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        sub.summary.percentage >= 70
                          ? "bg-success"
                          : sub.summary.percentage >= 40
                            ? "bg-warning"
                            : "bg-destructive"
                      }`}
                      style={{
                        width: `${Math.min(100, sub.summary.percentage)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <AccordionContent className="border-t px-4 py-4 space-y-4">
                {/* Summary stats */}
                <div className="grid gap-3 md:grid-cols-4">
                  <div className="rounded bg-muted/50 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Grade</p>
                    <p className="text-lg font-bold">
                      {sub.summary?.grade || "--"}
                    </p>
                  </div>
                  <div className="rounded bg-muted/50 p-3 text-center">
                    <p className="text-xs text-muted-foreground">
                      Questions Graded
                    </p>
                    <p className="text-lg font-bold">
                      {sub.summary?.questionsGraded ?? 0}/
                      {sub.summary?.totalQuestions ?? 0}
                    </p>
                  </div>
                  <div className="rounded bg-muted/50 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="text-sm font-medium capitalize">
                      {sub.pipelineStatus === "completed"
                        ? "Graded"
                        : sub.pipelineStatus === "grading"
                          ? "Being reviewed"
                          : "Processing"}
                    </p>
                  </div>
                  <div className="rounded bg-muted/50 p-3 text-center">
                    {tenantId && (
                      <DownloadPDFButton
                        onGenerate={async () => {
                          const res = await callGenerateReport({
                            tenantId: tenantId!,
                            type: 'exam-result',
                            examId: sub.examId,
                            studentId: sub.studentId,
                          });
                          return { downloadUrl: res.pdfUrl };
                        }}
                        label="Download PDF"
                        variant="ghost"
                        size="sm"
                      />
                    )}
                  </div>
                </div>

                {/* Per-question structured feedback */}
                {tenantId && (
                  <QuestionFeedbackSection
                    tenantId={tenantId}
                    submissionId={sub.id}
                  />
                )}

                {/* Improvement recommendations */}
                {(sub.summary?.percentage ?? 0) < 70 && sub.examSubject && (
                  <div className="rounded-lg border border-info/20 bg-info/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-info" />
                      <h4 className="text-sm font-semibold text-info">
                        Improvement Recommendations
                      </h4>
                    </div>
                    <ul className="space-y-1 text-sm text-info">
                      <li>
                        - Practice more {sub.examSubject} topics in the LevelUp
                        learning spaces
                      </li>
                      {(sub.summary?.percentage ?? 0) < 40 && (
                        <li>
                          - Focus on foundational concepts before attempting
                          advanced problems
                        </li>
                      )}
                      <li>
                        - Review the per-question feedback above and focus on
                        areas marked as weaknesses
                      </li>
                      <li>
                        - Check the Space Progress section for related learning
                        materials
                      </li>
                    </ul>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
