/**
 * processAnswerGrading — RELMS per-question grading pipeline worker.
 *
 * Grades each pending QuestionSubmission using Gemini with the RELMS prompt.
 * Resolves the rubric chain and builds dynamic prompts per question.
 * Includes quota checks, per-batch progress updates, and graceful degradation.
 */
export declare function processAnswerGrading(tenantId: string, submissionId: string): Promise<void>;
