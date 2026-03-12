/**
 * Scheduled function: cleanup truly stale test sessions (24h threshold).
 *
 * Runs hourly. Finds sessions that are:
 * - status === 'in_progress'
 * - createdAt is older than 24 hours
 *
 * These are sessions that were never properly submitted or expired via
 * the deadline-based expiry trigger. They are marked as 'abandoned'.
 *
 * This is distinct from on-test-session-expired.ts which handles
 * deadline-based expiry (serverDeadline + 30s grace).
 */
export declare const cleanupStaleSessions: import("firebase-functions/scheduler").ScheduleFunction;
