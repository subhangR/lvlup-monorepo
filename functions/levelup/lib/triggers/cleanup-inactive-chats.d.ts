/**
 * Scheduled function: deactivate inactive chat sessions (7-day threshold).
 *
 * Runs daily at 3:00 AM UTC. Finds chat sessions that are:
 * - isActive === true
 * - updatedAt is older than 7 days
 *
 * These sessions are deactivated (isActive = false) to reduce
 * query overhead and signal to the frontend that the session is stale.
 * The data is preserved for reference but won't appear in active session lists.
 */
export declare const cleanupInactiveChats: import("firebase-functions/scheduler").ScheduleFunction;
