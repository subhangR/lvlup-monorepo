import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '@levelup/shared-stores';
import { useSpace, useRealtimeDB, useRecordItemAttempt, useApiError } from '@levelup/shared-hooks';
import { realtimeDBService } from '@levelup/shared-services';
import { useStoryPoints } from '../hooks/useStoryPoints';
import { useStoryPointItems } from '../hooks/useSpaceItems';
import { useEvaluateAnswer } from '../hooks/useEvaluateAnswer';
import { QuestionAnswerer } from '../components/questions';
import { autoEvaluateClient } from '../utils/auto-evaluate-client';
import ChatTutorPanel from '../components/chat/ChatTutorPanel';
import ProgressBar from '../components/common/ProgressBar';
import type { UnifiedEvaluationResult, UnifiedItem } from '@levelup/shared-types';
import { Dumbbell, CheckCircle2, XCircle, Minus, Filter } from 'lucide-react';
import {
  Button,
  Badge,
  Skeleton,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@levelup/shared-ui';

interface PracticeProgressData {
  evaluations: Record<string, UnifiedEvaluationResult>;
  updatedAt: number;
}

export default function PracticeModePage() {
  const { spaceId, storyPointId } = useParams<{ spaceId: string; storyPointId: string }>();
  const { currentTenantId, user } = useAuthStore();
  const userId = user?.uid ?? null;

  const { data: space } = useSpace(currentTenantId, spaceId ?? null);
  const { data: storyPoints } = useStoryPoints(currentTenantId, spaceId ?? null);
  const { data: items, isLoading } = useStoryPointItems(currentTenantId, spaceId ?? null, storyPointId ?? null);
  const evaluateAnswer = useEvaluateAnswer();
  const recordAttempt = useRecordItemAttempt();
  const { handleError } = useApiError();

  const storyPoint = storyPoints?.find((sp) => sp.id === storyPointId);
  const questions = items?.filter((i) => i.type === 'question') ?? [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [evaluations, setEvaluations] = useState<Record<string, UnifiedEvaluationResult>>({});
  const [chatItemId, setChatItemId] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [rtdbLoaded, setRtdbLoaded] = useState(false);

  // Warn before leaving with unsaved progress
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (Object.keys(evaluations).length > 0) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [evaluations]);

  // Load persisted practice progress from RTDB
  const rtdbPath = userId && spaceId
    ? `practice/${userId}/${spaceId}`
    : null;

  const { data: persistedProgress } = useRealtimeDB<PracticeProgressData>(
    currentTenantId ?? '',
    rtdbPath ?? '',
    { disabled: !currentTenantId || !rtdbPath },
  );

  // Restore evaluations from RTDB on initial load
  useEffect(() => {
    if (persistedProgress?.evaluations && !rtdbLoaded) {
      setEvaluations(persistedProgress.evaluations);
      setRtdbLoaded(true);
    } else if (persistedProgress === null && !rtdbLoaded) {
      setRtdbLoaded(true);
    }
  }, [persistedProgress, rtdbLoaded]);

  // Persist evaluations to RTDB on change
  const persistToRTDB = useCallback(
    (newEvaluations: Record<string, UnifiedEvaluationResult>) => {
      if (!currentTenantId || !userId || !spaceId) return;
      const path = `practice/${userId}/${spaceId}`;
      realtimeDBService.setData(currentTenantId, path, {
        evaluations: newEvaluations,
        updatedAt: Date.now(),
      }).catch((err: unknown) => {
        handleError(err, 'Failed to save practice progress');
      });
    },
    [currentTenantId, userId, spaceId],
  );

  // Reset currentIndex when difficulty filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [difficultyFilter]);

  const filteredQuestions = difficultyFilter
    ? questions.filter((q) => q.difficulty === difficultyFilter)
    : questions;

  const currentQuestion = filteredQuestions[currentIndex];
  const totalSolved = Object.values(evaluations).filter(
    (e) => e.correctness >= 1,
  ).length;

  const handleSubmit = async (item: UnifiedItem, answer: unknown) => {
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

      const newEvaluations = { ...evaluations, [item.id]: evaluationResult };
      setEvaluations(newEvaluations);

      // Persist to RTDB as fast session cache
      persistToRTDB(newEvaluations);

      // Persist to Firestore via recordItemAttempt for durable progress tracking
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

  if (isLoading) {
    return <Skeleton className="h-32 rounded-lg" />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
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
            <BreadcrumbPage>{storyPoint?.title ?? 'Practice'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Dumbbell className="h-6 w-6 text-emerald-500" />
          <div>
            <h1 className="text-xl font-bold">{storyPoint?.title}</h1>
            <p className="text-sm text-muted-foreground">Practice Mode — Unlimited retries</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalSolved}/{filteredQuestions.length}</p>
          <p className="text-xs text-muted-foreground">Solved</p>
        </div>
      </div>

      {/* Score bar */}
      <ProgressBar
        value={totalSolved}
        max={filteredQuestions.length}
        color="green"
        label="Progress"
      />

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Difficulty:</span>
        {['easy', 'medium', 'hard'].map((d) => (
          <Badge
            key={d}
            variant={difficultyFilter === d ? 'default' : 'secondary'}
            className="cursor-pointer capitalize"
            onClick={() => setDifficultyFilter(difficultyFilter === d ? null : d)}
          >
            {d}
          </Badge>
        ))}
      </div>

      {/* Question navigator mini */}
      <div className="flex flex-wrap gap-1.5" role="navigation" aria-label="Practice question navigator">
        {filteredQuestions.map((q, idx) => {
          const eval_ = evaluations[q.id];
          const isCorrect = eval_ != null && eval_.correctness >= 1;
          const isIncorrect = eval_ != null && eval_.correctness === 0;
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Question ${idx + 1}: ${isCorrect ? 'Correct' : isIncorrect ? 'Incorrect' : 'Not attempted'}`}
              aria-current={isCurrent ? 'step' : undefined}
              className={`h-10 w-10 sm:h-8 sm:w-8 rounded text-xs font-medium ${
                isCorrect
                  ? 'bg-emerald-500 text-white'
                  : isIncorrect
                    ? 'bg-red-400 text-white'
                    : 'bg-muted text-muted-foreground'
              } ${isCurrent ? 'ring-2 ring-primary ring-offset-1' : ''}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Current Question */}
      {currentQuestion ? (
        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">
              Question {currentIndex + 1} of {filteredQuestions.length}
            </span>
            {evaluations[currentQuestion.id] && (
              evaluations[currentQuestion.id].correctness >= 1 ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : evaluations[currentQuestion.id].correctness === 0 ? (
                <XCircle className="h-5 w-5 text-destructive" />
              ) : (
                <Minus className="h-5 w-5 text-yellow-500" />
              )
            )}
          </div>

          <QuestionAnswerer
            key={currentQuestion.id}
            item={currentQuestion}
            onSubmit={(answer) => handleSubmit(currentQuestion, answer)}
            onOpenChat={() => setChatItemId(currentQuestion.id)}
            evaluation={evaluations[currentQuestion.id]}
            mode="practice"
            showCorrect
          />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No questions match the filter.</p>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentIndex(Math.min(filteredQuestions.length - 1, currentIndex + 1))}
          disabled={currentIndex >= filteredQuestions.length - 1}
        >
          Next
        </Button>
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
