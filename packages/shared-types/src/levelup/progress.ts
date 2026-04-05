/**
 * SpaceProgress — tracks a student's progress through a space.
 *
 * Two-tier storage model:
 *   Space-level:      /tenants/{tenantId}/spaceProgress/{userId}_{spaceId}
 *   StoryPoint-level: /tenants/{tenantId}/spaceProgress/{userId}_{spaceId}/storyPointProgress/{storyPointId}
 *
 * The space-level doc holds aggregate scores and per-storyPoint summaries.
 * Each storyPoint subdoc holds per-item progress with answers and evaluations.
 *
 * @module levelup/progress
 */

import type { FirestoreTimestamp } from "../identity/user";
import type { ItemType } from "../content/item";

export type ProgressStatus = "not_started" | "in_progress" | "completed";

export type QuestionProgressStatus = "pending" | "correct" | "incorrect" | "partial";

export interface QuestionProgressData {
  status: QuestionProgressStatus;
  attemptsCount: number;
  bestScore: number;
  pointsEarned: number;
  totalPoints: number;
  percentage: number;
  solved: boolean;

  /** Score from the most recent attempt (may differ from bestScore). */
  latestScore?: number;
  /** Status from the most recent attempt (may differ from status which tracks best). */
  latestStatus?: QuestionProgressStatus;
}

/**
 * Compact evaluation stored alongside item progress.
 * Contains the display-relevant fields from UnifiedEvaluationResult
 * so feedback can be shown on revisit without re-evaluating.
 */
export interface StoredEvaluation {
  score: number;
  maxScore: number;
  correctness: number;
  percentage: number;
  strengths: string[];
  weaknesses: string[];
  missingConcepts: string[];
  summary?: {
    keyTakeaway: string;
    overallComment: string;
  };
  mistakeClassification?: "Conceptual" | "Silly Error" | "Knowledge Gap" | "None";
}

/**
 * A single recorded attempt for an item.
 * Stored in the `attempts` array on ItemProgressEntry (capped at 20).
 */
export interface AttemptRecord {
  attemptNumber: number;
  answer: unknown;
  evaluation: StoredEvaluation;
  score: number;
  maxScore: number;
  timestamp: number;
}

export interface ItemProgressEntry {
  itemId: string;
  itemType: ItemType;
  completed: boolean;
  completedAt?: number;
  timeSpent?: number;
  interactions?: number;
  lastUpdatedAt: number;

  // Question-specific
  questionData?: QuestionProgressData;

  // Material-specific
  progress?: number;
  score?: number;
  feedback?: string;

  // Persisted answer and evaluation for revisit display (most recent)
  lastAnswer?: unknown;
  lastEvaluation?: StoredEvaluation;

  /** Attempt history (most recent last, capped at 20). */
  attempts?: AttemptRecord[];
}

export interface StoryPointProgress {
  storyPointId: string;
  status: ProgressStatus;
  pointsEarned: number;
  totalPoints: number;
  percentage: number;
  completedItems: number;
  totalItems: number;
  completedAt?: number;
}

/**
 * StoryPointProgressDoc — subcollection document per storyPoint.
 * Path: /tenants/{tenantId}/spaceProgress/{userId}_{spaceId}/storyPointProgress/{storyPointId}
 *
 * Contains per-item progress with answers and evaluations for display on revisit.
 */
export interface StoryPointProgressDoc {
  storyPointId: string;
  status: ProgressStatus;
  pointsEarned: number;
  totalPoints: number;
  percentage: number;
  completedItems: number;
  totalItems: number;
  completedAt?: number;
  updatedAt: number;

  /** Per-item progress with answers and evaluations. */
  items: Record<string, ItemProgressEntry>;
}

/**
 * SpaceProgress — space-level progress summary.
 * Path: /tenants/{tenantId}/spaceProgress/{userId}_{spaceId}
 *
 * Contains aggregate scores and per-storyPoint summaries.
 * Item-level details live in storyPointProgress subcollection.
 */
export interface SpaceProgress {
  id: string;
  userId: string;
  tenantId: string;
  spaceId: string;

  status: ProgressStatus;

  // Aggregate scores
  pointsEarned: number;
  totalPoints: number;
  marksEarned?: number;
  totalMarks?: number;
  percentage: number;

  // Per-story-point summary (no items — those live in subcollection)
  storyPoints: Record<string, StoryPointProgress>;

  // Timestamps
  startedAt?: FirestoreTimestamp;
  completedAt?: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}
