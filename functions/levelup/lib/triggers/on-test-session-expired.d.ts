/**
 * Scheduled function: cleanup stale timed test sessions.
 *
 * Runs every 5 minutes. Finds sessions that are:
 * - status === 'in_progress'
 * - serverDeadline has passed (+ 30s grace period has elapsed)
 *
 * These sessions are marked as 'expired' with autoSubmitted=true.
 * Per design doc §7.4: 24h threshold for truly stale sessions.
 */
export declare const onTestSessionExpired: import("firebase-functions/scheduler").ScheduleFunction;
