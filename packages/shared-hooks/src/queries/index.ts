export { useSpaces } from "./useSpaces";
export { useSpace } from "./useSpace";
export { useExams } from "./useExams";
export { useExam } from "./useExam";
export { useItems } from "./useItems";
export { useSubmissions } from "./useSubmissions";
export { useProgress, useAllSpaceProgress, useStoryPointProgress } from "./useProgress";
export { useEvaluationSettings } from "./useEvaluationSettings";

// Cross-system analytics hooks
export { useStudentProgressSummary, useStudentSummaries } from "./useStudentSummary";
export { useClassProgressSummary, useClassSummaries } from "./useClassSummary";
export { useExamAnalytics } from "./useExamAnalytics";
export { useDailyCostSummaries, useMonthlyCostSummary } from "./useCostSummary";
export { useStudentInsights, useDismissInsight } from "./useInsights";

// Tenant entity hooks
export { useClasses, useCreateClass, useUpdateClass, useDeleteClass } from "./useClasses";
export { useStudents, useCreateStudent, useUpdateStudent } from "./useStudents";
export { useTeachers, useCreateTeacher, useUpdateTeacher } from "./useTeachers";
export { useParents, useCreateParent } from "./useParents";
export {
  useAcademicSessions,
  useCreateAcademicSession,
  useUpdateAcademicSession,
} from "./useAcademicSessions";

// Notification hooks
export { useNotifications, useUnreadCount, useMarkRead, useMarkAllRead } from "./useNotifications";

// StoryPoint hooks
export {
  useStoryPoints,
  useStoryPoint,
  useCreateStoryPoint,
  useUpdateStoryPoint,
  useDeleteStoryPoint,
  useReorderStoryPoints,
} from "./useStoryPoints";

// Test session hooks
export { useTestSession, useStartTest, useSubmitTest } from "./useTestSessions";

// Chat & AI hooks
export { useChatSession, useSendMessage, useEvaluate } from "./useChatSessions";

// Auth management hooks
export { useCurrentUser, useUserMemberships, useSwitchTenant } from "./useAuthHooks";

// Tenant management hooks
export { useTenant, useTenantSettings, useUpdateTenant } from "./useTenant";

// Space mutation hooks
export {
  useCreateSpace,
  useUpdateSpace,
  usePublishSpace,
  useArchiveSpace,
  useDuplicateSpace,
} from "./useSpaceMutations";

// Space review hooks
export { useSpaceReviews, useSaveSpaceReview } from "./useSpaceReviews";

// Rubric preset hooks
export { useRubricPresets, useSaveRubricPreset } from "./useRubricPresets";

// Item mutation hooks
export {
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
  useBulkCreateItems,
} from "./useItemMutations";

// Exam mutation hooks
export { useCreateExam, useUpdateExam, usePublishExam } from "./useExamMutations";

// Submission mutation hooks
export {
  useUploadAnswerSheets,
  useGradeQuestion,
  useReleaseResults,
} from "./useSubmissionMutations";

// Progress mutation hooks
export { useRecordItemAttempt } from "./useRecordItemAttempt";

// Single-entity detail hooks
export {
  useClass,
  useStudent,
  useTeacher,
  useParent,
  useItem,
  useSubmission,
} from "./useEntityDetails";

// Achievement & Gamification hooks
export {
  useAchievements,
  useStudentAchievements,
  useStudentLevel,
  useStudyGoals,
} from "./useAchievements";

// Performance trends hook
export { usePerformanceTrends, type TrendDataPoint } from "./usePerformanceTrends";

// Re-export types from shared-types for convenience
export type { Space, Exam, Submission, EvaluationSettings } from "@levelup/shared-types";
export type { UnifiedItem as Item } from "@levelup/shared-types";
export type { SpaceProgress as StudentProgress } from "@levelup/shared-types";
export type { Class, Student, Teacher, Parent, AcademicSession } from "@levelup/shared-types";
export type { StoryPoint, DigitalTestSession, ChatSession } from "@levelup/shared-types";
export type { Tenant, UserMembership } from "@levelup/shared-types";
