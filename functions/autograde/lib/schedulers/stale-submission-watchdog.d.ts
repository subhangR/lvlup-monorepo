/**
 * Stale Submission Watchdog — Detects submissions stuck in processing states.
 *
 * Runs every 15 minutes. Finds submissions in 'scouting' or 'grading' status
 * for > 10 minutes and either retries them or escalates to manual review.
 */
export declare const staleSubmissionWatchdog: import("firebase-functions/scheduler").ScheduleFunction;
