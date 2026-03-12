/**
 * generateInsights — Cloud Scheduler function that runs nightly (after at-risk detection).
 * For each active student in each tenant, runs all insight rules and writes
 * insights to /tenants/{tenantId}/insights/{insightId}.
 * Limits each student to 5 active (non-dismissed) insights.
 */
export declare const generateInsights: import("firebase-functions/scheduler").ScheduleFunction;
