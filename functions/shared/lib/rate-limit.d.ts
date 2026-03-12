/**
 * Simple rate limiter using Firestore.
 * Tracks calls per user per action type within a sliding window.
 */
export declare function enforceRateLimit(tenantId: string, userId: string, actionType: string, maxPerMinute: number): Promise<void>;
