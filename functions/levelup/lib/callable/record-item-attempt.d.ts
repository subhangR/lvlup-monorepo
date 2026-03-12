/**
 * Record an item attempt for non-test items (standard storyPoints, practice, etc.).
 * Updates SpaceProgress with best score tracking.
 */
export declare const recordItemAttempt: import("firebase-functions/https").CallableFunction<any, Promise<{
    success: boolean;
    bestScore: number;
    attemptsCount: any;
    totalPointsEarned: number;
    overallPercentage: number;
}>, unknown>;
