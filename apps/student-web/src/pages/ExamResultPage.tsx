import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@levelup/shared-stores';
import { useExam, useSubmissions } from '@levelup/shared-hooks';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { getFirebaseServices } from '@levelup/shared-services';
import type { QuestionSubmission, Submission } from '@levelup/shared-types';
import ProgressBar from '../components/common/ProgressBar';
import {
  Button,
  Skeleton,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@levelup/shared-ui';
import {
  Award,
  BarChart3,
  CheckCircle2,
  XCircle,
  Minus,
  FileText,
  BookOpen,
  ChevronLeft,
  Printer,
} from 'lucide-react';

function useQuestionSubmissions(
  tenantId: string | null,
  submissionId: string | null,
) {
  return useQuery<QuestionSubmission[]>({
    queryKey: ['tenants', tenantId, 'submissions', submissionId, 'questionSubmissions'],
    queryFn: async () => {
      if (!tenantId || !submissionId) return [];
      const { db } = getFirebaseServices();
      const colRef = collection(
        db,
        `tenants/${tenantId}/submissions/${submissionId}/questionSubmissions`,
      );
      const q = query(colRef, orderBy('createdAt', 'asc'));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as QuestionSubmission);
    },
    enabled: !!tenantId && !!submissionId,
    staleTime: 5 * 60 * 1000,
  });
}

function GradeBadge({ grade }: { grade: string }) {
  const colorMap: Record<string, string> = {
    'A+': 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    A: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    'B+': 'bg-primary/10 text-primary',
    B: 'bg-primary/10 text-primary',
    'C+': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    C: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    D: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    F: 'bg-destructive/10 text-destructive',
  };
  const color = colorMap[grade] ?? 'bg-muted text-muted-foreground';

  return (
    <span className={`rounded-full px-3 py-1 text-sm font-bold ${color}`}>
      {grade}
    </span>
  );
}

function QuestionCard({ qs, index }: { qs: QuestionSubmission; index: number }) {
  const evaluation = qs.evaluation;
  const score = evaluation?.score ?? 0;
  const maxScore = evaluation?.maxScore ?? 0;
  const correctness = evaluation?.correctness;

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {correctness != null && correctness >= 1 ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          ) : correctness != null && correctness === 0 ? (
            <XCircle className="h-4 w-4 text-destructive" />
          ) : (
            <Minus className="h-4 w-4 text-yellow-500" />
          )}
          <span className="text-sm font-medium">
            Q{index + 1}
          </span>
        </div>
        <span className="text-sm font-bold">
          {score}/{maxScore}
        </span>
      </div>

      {/* Summary feedback */}
      {evaluation?.summary?.overallComment && (
        <div className="mt-2 rounded bg-muted/50 p-3 text-xs text-foreground">
          <p className="font-medium text-muted-foreground mb-1">Feedback:</p>
          <p className="whitespace-pre-wrap">{evaluation.summary.overallComment}</p>
        </div>
      )}

      {evaluation?.strengths && evaluation.strengths.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">Strengths:</p>
          <ul className="list-disc pl-4 text-xs text-muted-foreground">
            {evaluation.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {evaluation?.weaknesses && evaluation.weaknesses.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-medium text-destructive mb-1">Areas to Improve:</p>
          <ul className="list-disc pl-4 text-xs text-muted-foreground">
            {evaluation.weaknesses.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ExamResultPage() {
  const { examId } = useParams<{ examId: string }>();
  const { currentTenantId, user } = useAuthStore();
  const userId = user?.uid ?? null;

  const { data: exam } = useExam(currentTenantId, examId ?? null);
  const { data: submissions, isLoading: subsLoading } = useSubmissions(currentTenantId, {
    examId: examId ?? undefined,
    studentId: userId ?? undefined,
  });

  // Use the most recent submission for this student
  const submission = submissions?.[0] ?? null;

  const { data: questionSubmissions, isLoading: qsLoading } = useQuestionSubmissions(
    currentTenantId,
    submission?.id ?? null,
  );

  const isLoading = subsLoading || qsLoading;
  const summary = submission?.summary;

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">No results found for this exam.</p>
        <Button variant="link" asChild className="mt-4">
          <Link to="/results" className="gap-1">
            <ChevronLeft className="h-4 w-4" /> Back to Results
          </Link>
        </Button>
      </div>
    );
  }

  const percentage = summary?.percentage ?? 0;
  const grade = summary?.grade ?? '--';

  // Derive recommendations from weak topics using missingConcepts
  const weakTopics = (questionSubmissions ?? [])
    .filter((qs) => qs.evaluation && qs.evaluation.correctness < 0.5)
    .flatMap((qs) => qs.evaluation?.missingConcepts ?? []);
  const uniqueWeakTopics = [...new Set(weakTopics)];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to="/results">Results</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{exam?.title ?? 'Exam Results'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Result Summary */}
      <div className="rounded-lg border bg-card p-6 text-center">
        <Award
          className={`mx-auto mb-3 h-12 w-12 ${
            percentage >= 70 ? 'text-emerald-500' : percentage >= 40 ? 'text-yellow-500' : 'text-destructive'
          }`}
        />
        <h1 className="text-xl font-bold mb-2">{exam?.title ?? 'Exam Results'}</h1>

        <div className="flex items-center justify-center gap-4 mb-4">
          <GradeBadge grade={grade} />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <p className="text-3xl font-bold">{Math.round(percentage)}%</p>
            <p className="text-xs text-muted-foreground">Score</p>
          </div>
          <div>
            <p className="text-3xl font-bold">
              {summary?.totalScore ?? 0}/{summary?.maxScore ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">Marks</p>
          </div>
          <div>
            <p className="text-3xl font-bold">
              {summary?.questionsGraded ?? 0}/{summary?.totalQuestions ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">Graded</p>
          </div>
        </div>

        <div className="mt-4">
          <ProgressBar
            value={percentage}
            max={100}
            color={percentage >= 70 ? 'green' : percentage >= 40 ? 'orange' : 'red'}
          />
        </div>
      </div>

      {/* Per-Question Feedback */}
      {questionSubmissions && questionSubmissions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> Per-Question Breakdown
          </h2>
          {questionSubmissions.map((qs, idx) => (
            <QuestionCard key={qs.id} qs={qs} index={idx} />
          ))}
        </div>
      )}

      {/* Recommendations */}
      {uniqueWeakTopics.length > 0 && (
        <div className="rounded-lg border bg-amber-500/10 p-4 dark:border-amber-800">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" /> Recommended Practice
          </h3>
          <p className="text-xs text-muted-foreground mb-2">
            You scored below 50% on these topics. Consider practicing them:
          </p>
          <div className="flex flex-wrap gap-2">
            {uniqueWeakTopics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-amber-200 dark:border-amber-700 bg-background px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-400"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* PDF Download placeholder */}
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link to="/results">
            <ChevronLeft className="inline h-4 w-4 mr-1" />
            Back to Results
          </Link>
        </Button>
        <Button onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" /> Print Results
        </Button>
      </div>
    </div>
  );
}
