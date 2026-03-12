/**
 * processAnswerMapping — Panopticon scouting pipeline worker.
 *
 * Maps answer sheet pages to questions using Gemini's large context window.
 * Creates QuestionSubmission documents for each mapped question.
 */
export declare function processAnswerMapping(tenantId: string, submissionId: string): Promise<void>;
