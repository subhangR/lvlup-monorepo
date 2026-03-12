/**
 * finalizeSubmission — Aggregates question scores and calculates final grade.
 *
 * Called after all questions are graded (pipelineStatus → grading_complete).
 */
export declare function finalizeSubmission(tenantId: string, submissionId: string): Promise<void>;
