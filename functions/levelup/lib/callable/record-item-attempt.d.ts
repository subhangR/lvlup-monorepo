/**
 * Record an item attempt for non-test items (standard storyPoints, practice, etc.).
 * Updates SpaceProgress with best score tracking via the unified progress updater.
 *
 * Fixes applied:
 * - No pre-increment of attemptsCount/timeSpent — progress-updater handles merging
 * - Passes answer and evaluationData for persistence on revisit
 */
export declare const recordItemAttempt: import("firebase-functions/https").CallableFunction<
  any,
  Promise<{
    success: boolean;
    bestScore: number;
    attemptsCount: number;
    totalPointsEarned: number;
    overallPercentage: number;
  }>,
  unknown
>;
