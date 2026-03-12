/**
 * Monthly Usage Counter Reset — Runs on the 1st of each month at 00:00 UTC.
 *
 * Resets monthly counters (examsThisMonth, aiCallsThisMonth) for all
 * active and trial tenants. Processes in batches of 450.
 */
export declare const monthlyUsageReset: import("firebase-functions/scheduler").ScheduleFunction;
