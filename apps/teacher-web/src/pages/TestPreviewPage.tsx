import { useState, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCurrentTenantId } from '@levelup/shared-stores';
import { useSpace } from '@levelup/shared-hooks';
import {
  Button,
  Skeleton,
  Badge,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Switch,
  Label,
} from '@levelup/shared-ui';
import {
  ArrowLeft,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { getFirebaseServices } from '@levelup/shared-services';
import type { StoryPoint, UnifiedItem, QuestionPayload, StoryPointSection } from '@levelup/shared-types';
import { useEffect } from 'react';

export default function TestPreviewPage() {
  const { spaceId, storyPointId } = useParams<{ spaceId: string; storyPointId: string }>();
  const navigate = useNavigate();
  const tenantId = useCurrentTenantId();
  const { data: space } = useSpace(tenantId, spaceId ?? null);

  const [storyPoint, setStoryPoint] = useState<StoryPoint | null>(null);
  const [items, setItems] = useState<UnifiedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const startTime = useRef(Date.now());

  // Load story point and items
  useEffect(() => {
    if (!tenantId || !spaceId || !storyPointId) return;
    const load = async () => {
      try {
        const { db } = getFirebaseServices();

        // Load story point
        const spCol = collection(db, `tenants/${tenantId}/spaces/${spaceId}/storyPoints`);
        const spSnap = await getDocs(spCol);
        const sp = spSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }) as StoryPoint)
          .find((s) => s.id === storyPointId);
        setStoryPoint(sp ?? null);

        // Load items
        const itemsCol = collection(db, `tenants/${tenantId}/spaces/${spaceId}/items`);
        const itemsQ = query(
          itemsCol,
          where('storyPointId', '==', storyPointId),
          orderBy('orderIndex', 'asc'),
        );
        const itemsSnap = await getDocs(itemsQ);
        setItems(itemsSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as UnifiedItem));
      } catch {
        // Handled via empty state
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tenantId, spaceId, storyPointId]);

  const questionItems = useMemo(
    () => items.filter((i) => i.type === 'question'),
    [items],
  );

  const currentItem = questionItems[currentIndex] ?? null;
  const payload = currentItem?.payload as QuestionPayload | undefined;

  const sections: StoryPointSection[] = storyPoint?.sections ?? [];
  const currentSection = currentItem?.sectionId
    ? sections.find((s) => s.id === currentItem.sectionId)
    : null;

  const elapsedMinutes = Math.round((Date.now() - startTime.current) / 60000);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!storyPoint || questionItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <p className="text-muted-foreground">No questions found in this story point.</p>
        <Button variant="link" onClick={() => navigate(`/spaces/${spaceId}/edit`)}>
          Back to Editor
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Preview Banner */}
      <div className="rounded-md bg-blue-500/10 border border-blue-200 dark:border-blue-800 p-3 flex items-center gap-3">
        <Eye className="h-5 w-5 text-blue-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Preview Mode — answers are not saved
          </p>
          <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
            This simulates the student experience. No test session is created.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/spaces/${spaceId}/edit`)}
        >
          Exit Preview
        </Button>
      </div>

      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to="/spaces">Spaces</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/spaces/${spaceId}/edit`}>{space?.title ?? 'Space'}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Preview: {storyPoint.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Timer & Progress Bar */}
      <div className="flex items-center justify-between py-2 border-b sticky top-0 bg-background z-10">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            Q{currentIndex + 1}/{questionItems.length}
          </span>
          {currentSection && (
            <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
              {currentSection.title}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{storyPoint.assessmentConfig?.durationMinutes ?? '--'} min</span>
            <span className="text-xs">({elapsedMinutes}m elapsed)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Switch
              checked={showAnswers}
              onCheckedChange={setShowAnswers}
              id="show-answers"
            />
            <Label htmlFor="show-answers" className="text-xs cursor-pointer">
              Show Answers
            </Label>
          </div>
        </div>
      </div>

      {/* Question Navigator (inline) */}
      <div className="flex flex-wrap gap-1">
        {questionItems.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-8 w-8 text-xs rounded border transition-colors ${
              idx === currentIndex
                ? 'bg-primary text-primary-foreground border-primary'
                : answers[q.id] !== undefined
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300'
                  : 'bg-background hover:bg-muted'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Question Content */}
      {currentItem && (
        <div className="rounded-lg border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs capitalize">
              {payload?.questionType?.replace(/[-_]/g, ' ') ?? 'question'}
            </Badge>
            {currentItem.difficulty && (
              <Badge
                variant="outline"
                className={`text-xs ${
                  currentItem.difficulty === 'easy'
                    ? 'border-emerald-300 text-emerald-700'
                    : currentItem.difficulty === 'hard'
                      ? 'border-red-300 text-red-700'
                      : 'border-amber-300 text-amber-700'
                }`}
              >
                {currentItem.difficulty}
              </Badge>
            )}
            {payload?.basePoints && (
              <span className="text-xs text-muted-foreground">{payload.basePoints} pts</span>
            )}
          </div>

          <div className="text-sm whitespace-pre-wrap">
            {currentItem.title && <h3 className="font-medium mb-2">{currentItem.title}</h3>}
            <p>{payload?.content ?? currentItem.content}</p>
          </div>

          {/* MCQ Options Preview */}
          {(payload?.questionType === 'mcq' || payload?.questionType === 'mcaq') && (
            <div className="space-y-2">
              {((payload?.questionData as Record<string, unknown>)?.options as Array<{ id: string; text: string; isCorrect?: boolean }> | undefined)?.map((opt, idx) => (
                <div
                  key={opt.id ?? idx}
                  className={`flex items-center gap-2 rounded border p-3 text-sm cursor-pointer transition-colors ${
                    showAnswers && opt.isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setAnswers((prev) => ({ ...prev, [currentItem.id]: opt.id }))}
                >
                  <span className="h-5 w-5 rounded-full border flex items-center justify-center text-xs flex-shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{opt.text}</span>
                  {showAnswers && opt.isCorrect && (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* True/False Preview */}
          {payload?.questionType === 'true-false' && (
            <div className="flex gap-3">
              {['True', 'False'].map((val) => {
                const isCorrect = showAnswers &&
                  ((payload?.questionData as Record<string, unknown>)?.correctAnswer === (val === 'True'));
                return (
                  <button
                    key={val}
                    className={`flex-1 rounded border p-3 text-sm text-center transition-colors ${
                      isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setAnswers((prev) => ({ ...prev, [currentItem.id]: val === 'True' }))}
                  >
                    {val}
                    {isCorrect && <CheckCircle className="h-4 w-4 text-emerald-500 inline ml-2" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Show explanation when answers are revealed */}
          {showAnswers && payload?.explanation && (
            <div className="rounded bg-blue-50 dark:bg-blue-950/30 p-3 text-sm">
              <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">Explanation</p>
              <p className="text-blue-600/80 dark:text-blue-400/80">{payload.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {questionItems.length}
        </span>
        <Button
          onClick={() => setCurrentIndex(Math.min(questionItems.length - 1, currentIndex + 1))}
          disabled={currentIndex === questionItems.length - 1}
          className="gap-1"
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
