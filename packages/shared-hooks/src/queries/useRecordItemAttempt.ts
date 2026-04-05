import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  callRecordItemAttempt,
  type RecordItemAttemptRequest,
  type RecordItemAttemptResponse,
} from "@levelup/shared-services";
import type {
  SpaceProgress,
  StoryPointProgressDoc,
  ItemType,
  AttemptRecord,
} from "@levelup/shared-types";

interface OptimisticContext {
  previousSpace?: SpaceProgress | null;
  previousAll?: Record<string, SpaceProgress>;
  previousSP?: StoryPointProgressDoc | null;
  spaceKey?: readonly unknown[];
  allKey?: readonly unknown[];
  spKey?: readonly unknown[];
}

/**
 * Mutation hook that wraps `callRecordItemAttempt`.
 * Records a single item attempt and optimistically updates:
 *   1. Space-level progress cache (storyPoint summaries)
 *   2. StoryPoint-level progress cache (item details with answer/evaluation)
 *   3. Bulk "all spaces" progress cache
 */
export function useRecordItemAttempt(userId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation<RecordItemAttemptResponse, Error, RecordItemAttemptRequest, OptimisticContext>(
    {
      mutationFn: async (params: RecordItemAttemptRequest) => {
        return callRecordItemAttempt(params);
      },

      onMutate: async (variables) => {
        if (!userId) return {};

        const spaceKey = [
          "tenants",
          variables.tenantId,
          "progress",
          userId,
          variables.spaceId,
        ] as const;
        const allKey = ["tenants", variables.tenantId, "progress", userId, "all"] as const;
        const spKey = [
          "tenants",
          variables.tenantId,
          "progress",
          userId,
          variables.spaceId,
          "sp",
          variables.storyPointId,
        ] as const;

        // Cancel any in-flight refetches
        await queryClient.cancelQueries({ queryKey: spaceKey });
        await queryClient.cancelQueries({ queryKey: allKey });
        await queryClient.cancelQueries({ queryKey: spKey });

        // Snapshot previous values for rollback
        const previousSpace = queryClient.getQueryData<SpaceProgress | null>(spaceKey);
        const previousAll = queryClient.getQueryData<Record<string, SpaceProgress>>(allKey);
        const previousSP = queryClient.getQueryData<StoryPointProgressDoc | null>(spKey);

        // Optimistically update the storyPoint subdoc cache
        if (previousSP) {
          const updatedSP = applyStoryPointOptimisticUpdate(previousSP, variables);
          queryClient.setQueryData(spKey, updatedSP);
        }

        // Optimistically update the single-space progress cache
        if (previousSpace) {
          const updated = applySpaceOptimisticUpdate(previousSpace, variables);
          queryClient.setQueryData(spaceKey, updated);
        }

        // Optimistically update the bulk progress cache
        if (previousAll && previousAll[variables.spaceId]) {
          const updatedAll = { ...previousAll };
          updatedAll[variables.spaceId] = applySpaceOptimisticUpdate(
            previousAll[variables.spaceId]!,
            variables
          );
          queryClient.setQueryData(allKey, updatedAll);
        }

        return { previousSpace, previousAll, previousSP, spaceKey, allKey, spKey };
      },

      onError: (_err, _variables, context) => {
        // Rollback to the previous cache state
        if (context?.spaceKey && context.previousSpace !== undefined) {
          queryClient.setQueryData(context.spaceKey, context.previousSpace);
        }
        if (context?.allKey && context.previousAll !== undefined) {
          queryClient.setQueryData(context.allKey, context.previousAll);
        }
        if (context?.spKey && context.previousSP !== undefined) {
          queryClient.setQueryData(context.spKey, context.previousSP);
        }
      },

      onSettled: (_data, _error, variables) => {
        if (userId) {
          queryClient.invalidateQueries({
            queryKey: ["tenants", variables.tenantId, "progress", userId, variables.spaceId],
          });
          queryClient.invalidateQueries({
            queryKey: ["tenants", variables.tenantId, "progress", userId, "all"],
          });
          queryClient.invalidateQueries({
            queryKey: ["tenants", variables.tenantId, "progress", userId, "overall"],
          });
        }
      },
    }
  );
}

/** Apply an optimistic update to a StoryPointProgressDoc (item-level). */
function applyStoryPointOptimisticUpdate(
  spDoc: StoryPointProgressDoc,
  variables: RecordItemAttemptRequest
): StoryPointProgressDoc {
  const itemId = variables.itemId;
  const existingItem = spDoc.items?.[itemId];

  const prevBest = existingItem?.questionData?.bestScore ?? 0;
  const newBest = Math.max(variables.score, prevBest);
  const attemptsCount = (existingItem?.questionData?.attemptsCount ?? 0) + 1;
  const solved = variables.correct || (existingItem?.questionData?.solved ?? false);

  const latestStatus = variables.correct
    ? ("correct" as const)
    : variables.score > 0
      ? ("partial" as const)
      : ("incorrect" as const);

  // Build new attempt record
  const prevAttempts: AttemptRecord[] = existingItem?.attempts ?? [];
  const newAttempts =
    variables.answer != null && variables.evaluationData
      ? [
          ...prevAttempts,
          {
            attemptNumber: attemptsCount,
            answer: variables.answer,
            evaluation: variables.evaluationData,
            score: variables.score,
            maxScore: variables.maxScore,
            timestamp: Date.now(),
          } as AttemptRecord,
        ].slice(-20)
      : prevAttempts;

  const updatedItems = {
    ...spDoc.items,
    [itemId]: {
      ...(existingItem ?? {
        itemId,
        itemType: variables.itemType as ItemType,
        lastUpdatedAt: Date.now(),
      }),
      completed: solved || (variables.maxScore > 0 && newBest / variables.maxScore >= 0.5),
      lastUpdatedAt: Date.now(),
      questionData: {
        status: solved
          ? ("correct" as const)
          : newBest > 0
            ? ("partial" as const)
            : ("incorrect" as const),
        attemptsCount,
        bestScore: newBest,
        pointsEarned: newBest,
        totalPoints: variables.maxScore,
        percentage: variables.maxScore > 0 ? (newBest / variables.maxScore) * 100 : 0,
        solved,
        latestScore: variables.score,
        latestStatus,
      },
      // Persist answer and evaluation data
      lastAnswer: variables.answer ?? existingItem?.lastAnswer,
      lastEvaluation: variables.evaluationData ?? existingItem?.lastEvaluation,
      attempts: newAttempts,
    },
  };

  // Re-aggregate storyPoint totals from items
  let spPointsEarned = 0;
  let spPointsAvailable = 0;
  let completedItems = 0;

  for (const entry of Object.values(updatedItems)) {
    if (entry.questionData) {
      spPointsEarned += entry.questionData.bestScore ?? 0;
      spPointsAvailable += entry.questionData.totalPoints ?? 0;
    } else if (entry.itemType === "material" && entry.completed) {
      spPointsEarned += 1;
      spPointsAvailable += 1;
    } else if (entry.itemType === "material") {
      spPointsAvailable += 1;
    }
    if (entry.completed) completedItems++;
  }

  return {
    ...spDoc,
    pointsEarned: spPointsEarned,
    totalPoints: spPointsAvailable,
    percentage: spPointsAvailable > 0 ? (spPointsEarned / spPointsAvailable) * 100 : 0,
    completedItems,
    totalItems: Object.keys(updatedItems).length,
    items: updatedItems,
    updatedAt: Date.now(),
  };
}

/** Apply an optimistic update to a SpaceProgress object (space-level summaries). */
function applySpaceOptimisticUpdate(
  progress: SpaceProgress,
  variables: RecordItemAttemptRequest
): SpaceProgress {
  const storyPointId = variables.storyPointId;
  const existingSP = progress.storyPoints?.[storyPointId];

  // Estimate the delta using best-score logic
  // We don't have item-level data in the space doc, so approximate
  const prevSPPoints = existingSP?.pointsEarned ?? 0;
  const prevSPTotal = existingSP?.totalPoints ?? 0;

  // For a new attempt, the storyPoint earned might increase by up to (score - 0)
  // but we can't know the exact item best-score. Use a simple heuristic:
  // assume the score contributes additively (the server will correct on settle).
  const scoreDelta = variables.score; // optimistic: assume no previous score for this item
  const newSPPoints = prevSPPoints + scoreDelta;
  const newSPTotal = prevSPTotal > 0 ? prevSPTotal : variables.maxScore;

  const updatedStoryPoints = {
    ...progress.storyPoints,
    [storyPointId]: {
      ...(existingSP ?? {
        storyPointId,
        status: "in_progress" as const,
        pointsEarned: 0,
        totalPoints: 0,
        percentage: 0,
        completedItems: 0,
        totalItems: 0,
      }),
      pointsEarned: newSPPoints,
      totalPoints: newSPTotal,
      percentage: newSPTotal > 0 ? (newSPPoints / newSPTotal) * 100 : (existingSP?.percentage ?? 0),
      completedItems: (existingSP?.completedItems ?? 0) + (variables.correct ? 1 : 0),
    },
  };

  // Re-aggregate space totals from storyPoint summaries
  let totalPointsEarned = 0;
  let totalPointsAvailable = 0;
  for (const sp of Object.values(updatedStoryPoints)) {
    totalPointsEarned += sp.pointsEarned ?? 0;
    totalPointsAvailable += sp.totalPoints ?? 0;
  }

  const newPercentage =
    totalPointsAvailable > 0
      ? (totalPointsEarned / totalPointsAvailable) * 100
      : progress.percentage;

  return {
    ...progress,
    pointsEarned: totalPointsEarned,
    totalPoints: totalPointsAvailable,
    percentage: Math.min(newPercentage, 100),
    status: progress.status === "not_started" ? "in_progress" : progress.status,
    storyPoints: updatedStoryPoints,
  };
}

export type { RecordItemAttemptRequest, RecordItemAttemptResponse };
