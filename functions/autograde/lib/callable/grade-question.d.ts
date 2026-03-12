/**
 * gradeQuestion — Consolidated endpoint replacing:
 *   manualGradeQuestion, retryFailedQuestions
 *
 * - mode: 'manual' → grade a single question with manual override
 * - mode: 'retry'  → retry failed AI grading for a submission
 */
import type { GradeQuestionResponse } from '@levelup/shared-types';
export declare const gradeQuestion: import("firebase-functions/https").CallableFunction<any, Promise<GradeQuestionResponse>, unknown>;
