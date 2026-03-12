/**
 * LevelUp Cloud Functions — re-exported from @levelup/shared-types.
 * All canonical types live in packages/shared-types/src/.
 */

// ─── Content types (rubric, evaluation, items) ──────────────────────────────
export type {
  RubricScoringMode,
  RubricCriterion,
  EvaluationDimension,
  UnifiedRubric,
  UnifiedEvaluationResult,
  FeedbackItem,
  RubricBreakdownItem,
  UnifiedItem,
  ItemType,
  ItemPayload,
  QuestionPayload,
  QuestionType,
  MaterialType,
  ItemMetadata,
  BloomsLevel,
} from '@levelup/shared-types';

export {
  AUTO_EVALUATABLE_TYPES,
  AI_EVALUATABLE_TYPES,
} from '@levelup/shared-types';

// ─── LevelUp domain types ───────────────────────────────────────────────────
export type {
  Space,
  SpaceType,
  SpaceStatus,
  SpaceAccessType,
  SpaceStats,
  StoryPoint,
  StoryPointType,
  StoryPointSection,
  AssessmentConfig,
  StoryPointStats,
  Agent,
  AgentType,
  EvaluationObjective,
  DigitalTestSession,
  TestSessionStatus,
  TestSessionType,
  TestSubmission,
  TestAnalytics,
  AnalyticsBreakdownEntry,
  QuestionStatus,
  AdaptiveConfig,
  QuestionBankItem,
  QuestionBankFilter,
  SpaceProgress,
  StoryPointProgress,
  ItemProgressEntry,
  QuestionProgressData,
  ProgressStatus,
  ChatSession,
  ChatMessage,
  ChatMessageRole,
  AnswerKey,
  RubricPreset,
  RubricPresetCategory,
} from '@levelup/shared-types';
