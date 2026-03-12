import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@levelup/shared-stores';
import { useSpace, useProgress, useRecordItemAttempt, useApiError } from '@levelup/shared-hooks';
import { useStoryPoints } from '../hooks/useStoryPoints';
import { useStoryPointItems } from '../hooks/useSpaceItems';
import { useEvaluateAnswer } from '../hooks/useEvaluateAnswer';
import { QuestionAnswerer } from '../components/questions';
import { autoEvaluateClient } from '../utils/auto-evaluate-client';
import MaterialViewer from '../components/materials/MaterialViewer';
import ChatTutorPanel from '../components/chat/ChatTutorPanel';
import type { UnifiedItem, UnifiedEvaluationResult } from '@levelup/shared-types';
import {
  FileText,
  HelpCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from 'lucide-react';
import {
  Button,
  Input,
  Skeleton,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@levelup/shared-ui';

type ItemTypeFilter = 'all' | 'question' | 'material';
type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard';
type CompletionFilter = 'all' | 'completed' | 'incomplete';

function useDebouncedValue(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function StoryPointViewerPage() {
  const { spaceId, storyPointId } = useParams<{ spaceId: string; storyPointId: string }>();
  const navigate = useNavigate();
  const { currentTenantId, user } = useAuthStore();
  const userId = user?.uid ?? null;

  const { data: space } = useSpace(currentTenantId, spaceId ?? null);
  const { data: storyPoints } = useStoryPoints(currentTenantId, spaceId ?? null);
  const { data: items, isLoading, error: itemsError, isError: itemsHasError } = useStoryPointItems(currentTenantId, spaceId ?? null, storyPointId ?? null);
  const { data: progress } = useProgress(currentTenantId, userId, spaceId);
  const evaluateAnswer = useEvaluateAnswer();
  const recordAttempt = useRecordItemAttempt();
  const { handleError } = useApiError();

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [chatItemId, setChatItemId] = useState<string | null>(null);
  const [evaluations, setEvaluations] = useState<Record<string, UnifiedEvaluationResult>>({});
  // Filtering state
  const [itemTypeFilter, setItemTypeFilter] = useState<ItemTypeFilter>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [completionFilter, setCompletionFilter] = useState<CompletionFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  const storyPoint = storyPoints?.find((sp) => sp.id === storyPointId);
  const sections = storyPoint?.sections ?? [];

  // Prev/next navigation
  const currentIndex = storyPoints?.findIndex((sp) => sp.id === storyPointId) ?? -1;
  const prevSP = currentIndex > 0 && storyPoints ? storyPoints[currentIndex - 1] : null;
  const nextSP = currentIndex >= 0 && storyPoints && currentIndex < storyPoints.length - 1 ? storyPoints[currentIndex + 1] : null;

  const getStoryPointLink = (sp: { id: string; type: string }) => {
    const base = `/spaces/${spaceId}`;
    if (sp.type === 'timed_test' || sp.type === 'test') return `${base}/test/${sp.id}`;
    if (sp.type === 'practice') return `${base}/practice/${sp.id}`;
    return `${base}/story-points/${sp.id}`;
  };

  // Filter items
  const displayItems = useMemo(() => {
    let result = items ?? [];

    // Section filter
    if (activeSection) {
      result = result.filter((item) => item.sectionId === activeSection);
    }

    // Type filter
    if (itemTypeFilter !== 'all') {
      result = result.filter((item) => item.type === itemTypeFilter);
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      result = result.filter((item) => item.difficulty === difficultyFilter);
    }

    // Completion filter
    if (completionFilter !== 'all' && progress) {
      result = result.filter((item) => {
        const isCompleted = progress.items[item.id]?.completed ?? false;
        return completionFilter === 'completed' ? isCompleted : !isCompleted;
      });
    }

    // Search filter (debounced)
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((item) => {
        const title = item.title?.toLowerCase() ?? '';
        const content = item.content?.toLowerCase() ?? '';
        return title.includes(q) || content.includes(q);
      });
    }

    return result;
  }, [items, activeSection, itemTypeFilter, difficultyFilter, completionFilter, debouncedSearch, progress]);

  const handleSubmitAnswer = async (item: UnifiedItem, answer: unknown) => {
    if (!currentTenantId || !spaceId || !storyPointId) return;
    try {
      let evaluationResult: UnifiedEvaluationResult;

      // Try client-side evaluation first for deterministic question types
      const localResult = autoEvaluateClient(item, answer);
      if (localResult) {
        evaluationResult = localResult;
      } else {
        // Fall back to cloud function for AI-evaluatable types
        evaluationResult = await evaluateAnswer.mutateAsync({
          tenantId: currentTenantId,
          spaceId,
          storyPointId,
          itemId: item.id,
          answer,
          mode: 'practice',
        });
      }

      setEvaluations((prev) => ({ ...prev, [item.id]: evaluationResult }));

      // Persist the attempt to Firestore via recordItemAttempt
      recordAttempt.mutate({
        tenantId: currentTenantId,
        spaceId,
        storyPointId,
        itemId: item.id,
        itemType: 'question',
        score: evaluationResult.score,
        maxScore: evaluationResult.maxScore,
        correct: evaluationResult.correctness >= 1,
      });
    } catch (err) {
      handleError(err, 'Failed to evaluate answer');
    }
  };

  const hasActiveFilters = itemTypeFilter !== 'all' || difficultyFilter !== 'all' || completionFilter !== 'all' || searchQuery !== '';

  // Breadcrumb + h1 rendered in all states (loading, error, success)
  const header = (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to="/spaces">Spaces</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to={`/spaces/${spaceId}`}>{space?.title ?? 'Space'}</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{storyPoint?.title ?? 'Story Point'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-2">
        <h1 className="text-xl font-bold">{storyPoint?.title ?? 'Story Point'}</h1>
        {storyPoint?.description && (
          <p className="text-sm text-muted-foreground mt-1">{storyPoint.description}</p>
        )}
        {!storyPoint && storyPoints && storyPoints.length > 0 && (
          <p className="text-sm text-destructive mt-1">Story point not found</p>
        )}
      </div>
    </>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {header}
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  if (itemsHasError) {
    return (
      <div className="space-y-4">
        {header}
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <p className="text-sm font-medium text-destructive">Failed to load content items</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {itemsError instanceof Error ? itemsError.message : 'An unexpected error occurred'}
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Desktop Sidebar - Sections */}
      {sections.length > 1 && (
        <aside className="hidden lg:block w-48 flex-shrink-0">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Sections</h4>
          <nav className="space-y-1">
            <Button
              variant={activeSection === null ? 'secondary' : 'ghost'}
              size="sm"
              className="w-full justify-start"
              onClick={() => setActiveSection(null)}
            >
              All
            </Button>
            {sections
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? 'secondary' : 'ghost'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.title}
                </Button>
              ))}
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Mobile section picker */}
        {sections.length > 1 && (
          <div className="lg:hidden">
            <Select
              value={activeSection ?? 'all'}
              onValueChange={(v) => setActiveSection(v === 'all' ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Sections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {sections
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {header}

        {/* Prev/Next Navigation */}
        {storyPoints && storyPoints.length > 1 && (
          <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-2">
            {prevSP ? (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={() => navigate(getStoryPointLink(prevSP))}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{prevSP.title}</span>
                <span className="sm:hidden">Previous</span>
              </Button>
            ) : (
              <div />
            )}
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1} / {storyPoints.length}
            </span>
            {nextSP ? (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={() => navigate(getStoryPointLink(nextSP))}
              >
                <span className="hidden sm:inline">{nextSP.title}</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <div />
            )}
          </div>
        )}

        {/* Content Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
          <Select value={itemTypeFilter} onValueChange={(v) => setItemTypeFilter(v as ItemTypeFilter)}>
            <SelectTrigger className="w-[130px] h-8 text-sm">
              <Filter className="h-3 w-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="question">Questions</SelectItem>
              <SelectItem value="material">Materials</SelectItem>
            </SelectContent>
          </Select>
          <Select value={difficultyFilter} onValueChange={(v) => setDifficultyFilter(v as DifficultyFilter)}>
            <SelectTrigger className="w-[130px] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Select value={completionFilter} onValueChange={(v) => setCompletionFilter(v as CompletionFilter)}>
            <SelectTrigger className="w-[130px] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                setItemTypeFilter('all');
                setDifficultyFilter('all');
                setCompletionFilter('all');
                setSearchQuery('');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Items */}
        {displayItems.map((item) => {
          const itemProgress = progress?.items[item.id];
          const isCompleted = itemProgress?.completed;

          return (
            <div key={item.id} className="rounded-lg border bg-card p-5">
              <div className="flex items-start gap-2 mb-3">
                {item.type === 'material' ? (
                  <FileText className="h-4 w-4 text-primary mt-0.5" />
                ) : item.type === 'question' ? (
                  <HelpCircle className="h-4 w-4 text-purple-500 mt-0.5" />
                ) : null}
                {isCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />}
                {item.difficulty && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                    item.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    item.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {item.difficulty}
                  </span>
                )}
              </div>

              {item.type === 'material' ? (
                <MaterialViewer
                  item={item}
                  onComplete={(itemId) => {
                    if (!currentTenantId || !spaceId || !storyPointId) return;
                    recordAttempt.mutate({
                      tenantId: currentTenantId,
                      spaceId,
                      storyPointId,
                      itemId,
                      itemType: 'material',
                      score: 1,
                      maxScore: 1,
                      correct: true,
                    });
                  }}
                />
              ) : item.type === 'question' ? (
                <QuestionAnswerer
                  item={item}
                  onSubmit={(answer) => handleSubmitAnswer(item, answer)}
                  onOpenChat={() => setChatItemId(item.id)}
                  evaluation={evaluations[item.id]}
                  mode="practice"
                  showCorrect
                />
              ) : (
                <div className="text-sm text-muted-foreground">
                  {item.title ?? 'Content item'}
                </div>
              )}
            </div>
          );
        })}

        {!displayItems.length && (
          <p className="text-sm text-muted-foreground">
            {hasActiveFilters ? 'No items match your filters.' : 'No items in this section.'}
          </p>
        )}

        {/* Bottom Prev/Next Navigation */}
        {storyPoints && storyPoints.length > 1 && (
          <div className="flex items-center justify-between pt-4 border-t">
            {prevSP ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => navigate(getStoryPointLink(prevSP))}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            ) : (
              <div />
            )}
            {nextSP ? (
              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => navigate(getStoryPointLink(nextSP))}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="gap-1.5"
                onClick={() => navigate(`/spaces/${spaceId}`)}
              >
                Back to Space
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Chat Panel */}
      {chatItemId && spaceId && storyPointId && (
        <ChatTutorPanel
          spaceId={spaceId}
          storyPointId={storyPointId}
          itemId={chatItemId}
          onClose={() => setChatItemId(null)}
        />
      )}
    </div>
  );
}
