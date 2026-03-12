/**
 * nightlyAtRiskDetection — Cloud Scheduler function that runs at 2:00 AM daily.
 * Scans all StudentProgressSummary documents, applies at-risk rules, and
 * updates the isAtRisk and atRiskReasons fields.
 */
export declare const nightlyAtRiskDetection: import("firebase-functions/scheduler").ScheduleFunction;
