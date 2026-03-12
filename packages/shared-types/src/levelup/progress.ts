/**
 * SpaceProgress — tracks a student's progress through a space.
 * Collection: /tenants/{tenantId}/spaceProgress/{userId}_{spaceId}
 * @module levelup/progress
 */

import type { FirestoreTimestamp } from '../identity/user';
import type { ItemType } from '../content/item';

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export type QuestionProgressStatus = 'pending' | 'correct' | 'incorrect' | 'partial';

export interface QuestionProgressData {
  status: QuestionProgressStatus;
  attemptsCount: number;
  bestScore: number;
  pointsEarned: number;
  totalPoints: number;
  percentage: number;
  solved: boolean;
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
}

export interface StoryPointProgress {
  storyPointId: string;
  status: ProgressStatus;
  pointsEarned: number;
  totalPoints: number;
  percentage: number;
  completedAt?: number;
}

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

  // Per-story-point progress
  storyPoints: Record<string, StoryPointProgress>;

  // Per-item progress (flat map for quick lookup)
  items: Record<string, ItemProgressEntry>;

  // Timestamps
  startedAt?: FirestoreTimestamp;
  completedAt?: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}
