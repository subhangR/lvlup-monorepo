/**
 * LevelUp assessment callable wrappers.
 * Covers: startTestSession, submitTestSession, evaluateAnswer, recordItemAttempt
 */

import { httpsCallable } from "firebase/functions";
import { getFirebaseServices } from "../firebase";
import type { UnifiedEvaluationResult } from "@levelup/shared-types";

// ---------------------------------------------------------------------------
// Request / Response types
// ---------------------------------------------------------------------------

export interface StartTestSessionRequest {
  tenantId: string;
  spaceId: string;
  storyPointId: string;
}

export interface StartTestSessionResponse {
  sessionId: string;
}

export interface SubmitTestSessionRequest {
  tenantId: string;
  sessionId: string;
  submissions?: Record<string, unknown>;
  autoSubmitted?: boolean;
}

export interface SubmitTestSessionResponse {
  success: boolean;
}

export interface EvaluateAnswerRequest {
  tenantId: string;
  spaceId: string;
  storyPointId: string;
  itemId: string;
  answer: unknown;
  mode: "practice" | "quiz";
}

export interface RecordItemAttemptRequest {
  tenantId: string;
  spaceId: string;
  storyPointId: string;
  itemId: string;
  itemType: string;
  score: number;
  maxScore: number;
  correct: boolean;
  timeSpent?: number;
  feedback?: string;
  /** Student's answer for persistence (displayed on revisit). */
  answer?: unknown;
  /** Compact evaluation result for persistence (displayed on revisit). */
  evaluationData?: {
    score: number;
    maxScore: number;
    correctness: number;
    percentage: number;
    strengths: string[];
    weaknesses: string[];
    missingConcepts: string[];
    summary?: { keyTakeaway: string; overallComment: string };
    mistakeClassification?: "Conceptual" | "Silly Error" | "Knowledge Gap" | "None";
  };
}

export interface RecordItemAttemptResponse {
  success: boolean;
}

// ---------------------------------------------------------------------------
// Callable wrappers
// ---------------------------------------------------------------------------

function getCallable<Req, Res>(name: string) {
  const { functions } = getFirebaseServices();
  return httpsCallable<Req, Res>(functions, name);
}

export async function callStartTestSession(
  data: StartTestSessionRequest
): Promise<StartTestSessionResponse> {
  const fn = getCallable<StartTestSessionRequest, StartTestSessionResponse>("startTestSession");
  const result = await fn(data);
  return result.data;
}

export async function callSubmitTestSession(
  data: SubmitTestSessionRequest
): Promise<SubmitTestSessionResponse> {
  const fn = getCallable<SubmitTestSessionRequest, SubmitTestSessionResponse>("submitTestSession");
  const result = await fn(data);
  return result.data;
}

export async function callEvaluateAnswer(
  data: EvaluateAnswerRequest
): Promise<UnifiedEvaluationResult> {
  const fn = getCallable<EvaluateAnswerRequest, UnifiedEvaluationResult>("evaluateAnswer");
  const result = await fn(data);
  return result.data;
}

export async function callRecordItemAttempt(
  data: RecordItemAttemptRequest
): Promise<RecordItemAttemptResponse> {
  const fn = getCallable<RecordItemAttemptRequest, RecordItemAttemptResponse>("recordItemAttempt");
  const result = await fn(data);
  return result.data;
}
