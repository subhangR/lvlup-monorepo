/**
 * dailyCostAggregation — Cloud Scheduler function that runs at 1:00 AM daily.
 * Aggregates LLM call logs from the previous day into a DailyCostSummary
 * document and checks budget limits.
 */
export declare const dailyCostAggregation: import("firebase-functions/scheduler").ScheduleFunction;
