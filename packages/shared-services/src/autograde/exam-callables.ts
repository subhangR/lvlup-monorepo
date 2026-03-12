/**
 * AutoGrade exam callable wrappers.
 */

import { httpsCallable } from 'firebase/functions';
import { getFirebaseServices } from '../firebase';
import type {
  SaveResponse,
  SaveExamRequest,
  GradeQuestionRequest,
  GradeQuestionResponse,
} from '@levelup/shared-types';

// ---------------------------------------------------------------------------
// Upload types (kept as-is — not consolidated)
// ---------------------------------------------------------------------------

export interface UploadAnswerSheetsRequest {
  tenantId: string;
  examId: string;
  studentId: string;
  classId: string;
  imageUrls: string[];
}

export interface UploadAnswerSheetsResponse {
  submissionId: string;
}

// ---------------------------------------------------------------------------
// Callable wrappers
// ---------------------------------------------------------------------------

function getCallable<Req, Res>(name: string) {
  const { functions } = getFirebaseServices();
  return httpsCallable<Req, Res>(functions, name);
}

export async function callSaveExam(data: SaveExamRequest): Promise<SaveResponse> {
  const fn = getCallable<SaveExamRequest, SaveResponse>('saveExam');
  const result = await fn(data);
  return result.data;
}

export async function callGradeQuestion(data: GradeQuestionRequest): Promise<GradeQuestionResponse> {
  const fn = getCallable<GradeQuestionRequest, GradeQuestionResponse>('gradeQuestion');
  const result = await fn(data);
  return result.data;
}

export async function callUploadAnswerSheets(
  data: UploadAnswerSheetsRequest,
): Promise<UploadAnswerSheetsResponse> {
  const fn = getCallable<UploadAnswerSheetsRequest, UploadAnswerSheetsResponse>('uploadAnswerSheets');
  const result = await fn(data);
  return result.data;
}

// ---------------------------------------------------------------------------
// extractQuestions callable
// ---------------------------------------------------------------------------

export interface ExtractQuestionsRequest {
  tenantId: string;
  examId: string;
  mode?: 'full' | 'single';
  questionNumber?: string;
}

export interface ExtractQuestionsResponse {
  success: boolean;
  questions: unknown[];
  metadata: {
    questionCount: number;
    tokensUsed: number;
    cost: number;
    extractedAt: string;
  };
}

export async function callExtractQuestions(
  data: ExtractQuestionsRequest,
): Promise<ExtractQuestionsResponse> {
  const fn = getCallable<ExtractQuestionsRequest, ExtractQuestionsResponse>('extractQuestions');
  const result = await fn(data);
  return result.data;
}
