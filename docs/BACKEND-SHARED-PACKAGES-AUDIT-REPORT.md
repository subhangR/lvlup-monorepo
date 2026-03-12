# Backend & Shared Packages Audit Report

**Date:** 2026-03-01
**Scope:** shared-types, shared-services, shared-hooks, shared-stores, Cloud Functions, Firestore Rules
**Reference:** `docs/unified-design-plan/UNIFIED-ARCHITECTURE-BLUEPRINT.md`

---

## Executive Summary

| Area | Completeness | Critical Issues | High Issues | Medium Issues | Low Issues |
|------|-------------|-----------------|-------------|---------------|------------|
| **shared-types** | 70% | 5 entities with major gaps | 24 | 11 | — |
| **shared-services** | 82% | 0 | 1 | 3 | 3 |
| **shared-hooks** | 51% | 0 | 22 missing hooks | 14 missing hooks | 4 |
| **shared-stores** | 96% | 0 | 0 | 2 | 2 |
| **Cloud Functions** | 80% | 4 | 6 | 11 | — |
| **Firestore Rules** | 85% | 3 | 3 | 5 | 3 |
| **TOTAL** | — | **12** | **56** | **46** | **12** |

**Overall Risk Level: MEDIUM-HIGH** — Core infrastructure is solid but critical gaps in type definitions, disabled triggers, missing hooks, and security rules need immediate attention.

---

## 1. SHARED-TYPES AUDIT (`packages/shared-types`)

### Fully Compliant Types (no issues)
- `UnifiedUser` — All fields match blueprint
- `UserMembership` — All fields match blueprint (2 acceptable extra fields)
- `PlatformClaims` — Complete match
- `Tenant` — Complete match (all nested types correct)
- `Space` — Complete match (extra B2C marketplace fields acceptable)

### Types with Issues

#### CRITICAL — Teacher (`src/tenant/teacher.ts`)
**Missing 10 fields:** email?, phone?, authUid?, firstName, lastName, displayName?, employeeId?, department?, sectionIds?, lastLogin?
**Name mismatch:** `uid` should be `authUid`
Only has: id, tenantId, name, uid, designation?, subjects, classIds, status, createdAt, updatedAt

#### CRITICAL — Parent (`src/tenant/parent.ts`)
**Missing 8 fields:** email?, phone?, authUid?, firstName, lastName, displayName?, linkedStudentNames?, lastLogin?
**Name mismatches:** `uid` → `authUid`, `childStudentIds` → `studentIds`

#### CRITICAL — UnifiedRubric (`src/content/rubric.ts`)
**Missing 9 blueprint fields:** id, tenantId, totalMarks, isDefault?, createdBy, createdAt, updatedAt, title
Architecture mismatch: Code is content-focused rubric config, blueprint expects entity-level rubric with collection identity

#### CRITICAL — UnifiedItem (`src/content/item.ts`)
**Type system architecture mismatch:** Blueprint expects flat item types (`mcq`, `short_answer`, `long_answer`, etc.), code uses hierarchical system (ItemType → QuestionType with 15 subtypes)
**Missing question types:** diagram, file_upload, video_response, short_answer (as named), long_answer (as named)

#### HIGH — Student (`src/tenant/student.ts`)
**Missing:** authUid (uses `uid`), email?, phone?, displayName?, lastLogin?, metadata?
**Extra:** section?, grade?, admissionNumber?, dateOfBirth? (should be in metadata)

#### HIGH — Class (`src/tenant/class.ts`)
**Missing:** displayOrder?, createdBy, subject?
**Extra:** section?, studentIds (blueprint uses studentCount)

#### HIGH — StoryPoint (`src/levelup/story-point.ts`)
**Type mismatch:** Blueprint expects `lesson|quiz|practice|assessment|mixed`, code has `standard|timed_test|quiz|practice|test`

#### HIGH — Submission (`src/autograde/submission.ts`)
**Structure mismatch:** Blueprint has flat scores (totalScore, maxScore, percentage), code nests them in `SubmissionSummary`
**Missing:** extractedAnswers?, gradedAt?, gradedBy?, overrideHistory?

#### HIGH — SpaceProgress (`src/levelup/progress.ts`)
**Missing:** completedStoryPointIds, totalItems, completedItems, lastActivityAt, createdAt
**Naming mismatch:** totalScore→pointsEarned, maxPossibleScore→totalPoints

#### HIGH — StudentProgressSummary (`src/progress/summary.ts`)
**Missing aggregated fields:** totalSpaces, completedSpaces, avgScore, totalTimeSpentMinutes, streakDays, lastActivityAt
**Structure:** Blueprint expects flat fields, code uses nested autograde/levelup metrics

#### MISSING — LLMCallLog
**No type definition found anywhere in shared-types.** Blueprint requires: id, tenantId, functionName, model, inputTokens, outputTokens, totalTokens, costUSD, latencyMs, status, errorMessage?, userId?, examId?, spaceId?, createdAt

#### MEDIUM — DigitalTestSession (`src/levelup/test-session.ts`)
Field naming: `completedAt` → `endedAt`, `timeSpentSeconds` → `durationMinutes`
Structure: generic Map → structured Record<string, TestSubmission>

#### MEDIUM — AgentConfig (`src/levelup/agent.ts`)
Missing `practice` in AgentType enum, missing `maxTokens?` field

---

## 2. SHARED-SERVICES AUDIT (`packages/shared-services`)

### What's Working Well
- **FirestoreService** — Generic CRUD with proper tenant-scoping (`organizations/{orgId}/...`)
- **StorageService** — Complete tenant-scoped file operations
- **RealtimeDBService** — Complete CRUD + real-time subscriptions with tenant isolation
- **LLMWrapper** — Production-ready with retry logic, exponential backoff, token tracking, cost estimation
- **SecretManager** — Secure per-tenant Gemini API key management via GCP Secret Manager
- **CostTracker** — Accurate pricing model for Gemini models with fallback
- **LLMLogger** — Correct audit logging to `tenants/{tenantId}/llmCallLogs`
- **Auth callables** — Complete wrapper layer for all Cloud Function callables
- **PDF/Exam callables** — Complete wrapper layers

### Issues Found

| File | Lines | Severity | Issue |
|------|-------|----------|-------|
| `auth/membership-service.ts` | 1-44 | **HIGH** | Read-only: no CREATE/UPDATE/DELETE for UserMembership (delegated to CF but limits local testability) |
| `firestore/index.ts` | 54-116 | **MEDIUM** | No entity-specific query builders — consumers must construct Firestore queries manually |
| `ai/llm-logger.ts` | 56 | **MEDIUM** | Path inconsistency: uses `tenants/{tenantId}/llmCallLogs` while everything else uses `organizations/{orgId}/...` |
| `ai/llm-wrapper.ts` | 110-124 | **LOW** | Error detection via string matching (fragile for Gemini SDK changes) |
| `firebase/config.ts` | 97 | **LOW** | Region hardcoded to `asia-south1` |
| General | — | **MEDIUM** | No client-side tenantId validation middleware (relies entirely on Firestore rules) |

---

## 3. SHARED-HOOKS AUDIT (`packages/shared-hooks`)

### Coverage: 38 of 74 expected hooks implemented (51%)

### What's Implemented & Working Well
- **Entity List Queries:** useClasses, useStudents, useTeachers, useParents, useSpaces, useExams, useSubmissions — all use React Query correctly with tenantId scoping, staleTime, enabled flags
- **Entity Mutations:** useCreateClass, useUpdateClass, useDeleteClass, useCreateStudent, useUpdateStudent, useCreateTeacher, useUpdateTeacher, useCreateParent — proper invalidation
- **Single Entity:** useSpace, useExam — correct pattern
- **Analytics:** useProgress, useStudentProgressSummary, useClassProgressSummary, useExamAnalytics, useDailyCostSummaries, useMonthlyCostSummary
- **Notifications:** useNotifications, useUnreadCount, useMarkRead, useMarkAllRead
- **Academic Sessions:** useAcademicSessions, useCreateAcademicSession, useUpdateAcademicSession
- **Insights:** useStudentInsights, useDismissInsight
- **Items:** useItems (with infinite query pagination)
- **Evaluation Settings:** useEvaluationSettings

### MISSING Hooks — Priority 1 (CRITICAL for core flows)

| Hook | Category | Impact |
|------|----------|--------|
| useStoryPoints, useStoryPoint, useCreateStoryPoint, useUpdateStoryPoint, useReorderStoryPoints | **Content** | Cannot manage space content structure |
| useTestSession, useStartTest, useSubmitTest | **Assessment** | Student test-taking flow broken |
| useChatSession, useSendMessage, useEvaluate | **AI/Chat** | AI tutoring flow broken |
| useCurrentUser, useUserMemberships, useSwitchTenant | **Auth** | Auth management incomplete |
| useTenant, useTenantSettings, useUpdateTenant | **Tenant** | Tenant management incomplete |

### MISSING Hooks — Priority 2 (HIGH for key features)

| Hook | Category | Impact |
|------|----------|--------|
| useCreateSpace, useUpdateSpace, usePublishSpace | **Spaces** | Cannot create/manage spaces |
| useCreateItem, useUpdateItem, useBulkCreateItems | **Items** | Cannot create/manage items |
| useCreateExam, useUpdateExam, usePublishExam | **Exams** | Cannot create/manage exams |
| useUploadAnswerSheets, useGradeQuestion, useReleaseResults | **Submissions** | AutoGrade grading flow broken |
| useClass, useStudent, useTeacher, useParent, useItem, useSubmission | **Detail** | No single-entity detail fetching |

### MISSING Hooks — Priority 3 (MEDIUM)

| Hook | Category |
|------|----------|
| useBulkImportStudents | Students |
| useUpdateParent | Parents |
| useLeaderboard | Gamification |
| useClassAnalytics, useStudentAnalytics | Analytics |
| useLLMUsage | Cost tracking |

### Implementation Quality Issues

| File | Severity | Issue |
|------|----------|-------|
| `auth/useAuth.ts` | **HIGH** | Uses useState/useEffect instead of React Query — inconsistent with all other hooks |
| `queries/useNotifications.ts:48` | **MEDIUM** | useUnreadCount uses useState/useEffect while rest of file uses React Query |
| All mutation hooks | **MEDIUM** | No `onError` callbacks defined in mutations |
| Various query files | **LOW** | Inconsistent query key structure for filter options |

---

## 4. SHARED-STORES AUDIT (`packages/shared-stores`)

### Overall Score: 96/100 — Excellent

All four required Zustand stores are implemented with strong patterns:

| Store | Score | Notes |
|-------|-------|-------|
| **auth-store** | 100/100 | Firebase sync, multi-tenant switching via CF, proper token refresh, real-time user listener |
| **tenant-store** | 95/100 | Real-time Firestore listener, proper reset on switch |
| **consumer-store** | 95/100 | Cart with persist middleware, duplicate prevention |
| **ui-store** | 98/100 | Sidebar, modals, toasts with auto-dismiss and timer cleanup |

### Minor Issues

| Severity | Issue |
|----------|-------|
| **MEDIUM** | Consumer-store missing unit tests (3 other stores have comprehensive tests) |
| **MEDIUM** | No integration hooks between stores (auth↔tenant, auth↔consumer lifecycle) |
| **LOW** | Consumer-store missing from package.json conditional exports |

---

## 5. CLOUD FUNCTIONS AUDIT (`functions/`)

### Module Status

| Module | Completeness | Key Concern |
|--------|-------------|-------------|
| **Identity** (`functions/identity/`) | 70% | Core triggers disabled, 3 callables missing |
| **LevelUp** (`functions/levelup/`) | 85% | LLM call logging missing |
| **Analytics** (`functions/analytics/`) | 90% | Wrong membership collection path |
| **AutoGrade** (`functions/autograde/`) | 75% | Pipeline triggers disabled, breaking grading flow |

### CRITICAL Issues

#### 1. Disabled AutoGrade Pipeline Triggers (`functions/autograde/src/index.ts:21-24`)
`onSubmissionUpdated` and `onQuestionSubmissionUpdated` are commented out ("temporarily disabled - need to delete existing HTTPS versions first"). **Impact:** Automated grading pipeline cannot transition states — submissions stuck in "scouting" status. The trigger code EXISTS in source files but is NOT EXPORTED.

#### 2. Disabled Identity Triggers (`functions/identity/src/index.ts:5-11`)
`onUserCreated`, `onUserDeleted`, `onClassDeleted`, `onStudentDeleted` all disabled ("need IAM permissions to propagate"). **Impact:** New users won't get platform profile docs, deletions won't cascade.

#### 3. Missing LLM Call Logging Across ALL Modules
**5 functions** call LLM but never persist metadata to `llmCallLogs`:
- `functions/levelup/src/callable/send-chat-message.ts:140`
- `functions/levelup/src/callable/evaluate-answer.ts:72`
- `functions/autograde/src/callable/extract-questions.ts:64`
- `functions/autograde/src/pipeline/process-answer-mapping.ts:77`
- `functions/autograde/src/pipeline/process-answer-grading.ts:233`

**Impact:** Cost reports will always show $0, no audit trail for AI operations, `dailyCostAggregation` scheduler finds nothing to aggregate.

#### 4. Incomplete onSubmissionCreated (`functions/autograde/src/triggers/on-submission-created.ts:39-42`)
Only sets `pipelineStatus: 'scouting'` but doesn't call `processAnswerMapping()`. Relies on `onSubmissionUpdated` (which is disabled) to do actual work.

### HIGH Issues

| File | Issue |
|------|-------|
| `functions/identity/src/index.ts` | Missing callables: `createOrgUser`, `switchActiveTenant`, `joinTenant` — required for multi-tenant user management |
| `functions/analytics/src/callable/get-summary.ts:35` | Queries `tenants/{tenantId}/memberships` (doesn't exist) — should query `userMemberships` collection |
| `functions/autograde/src/pipeline/` | LLM result.cost computed but discarded (not logged) |

### MEDIUM Issues

| File | Lines | Issue |
|------|-------|-------|
| `identity/callable/bulk-import-students.ts` | 206-264 | Plaintext passwords in response, no encryption |
| `identity/callable/save-tenant.ts` | 138 | No cross-tenant validation on UPDATE |
| `levelup/callable/send-chat-message.ts` | 50 | Per-user rate limit (10/min) but no tenant-wide limits |
| `levelup/callable/evaluate-answer.ts` | 41 | Per-user rate limit (5/min) but no tenant-wide limits |
| `autograde/callable/upload-answer-sheets.ts` | 36 | Scanner role accepted but no class/exam-specific permission check |
| `autograde/callable/extract-questions.ts` | 25 | No check that exam belongs to caller's permitted classes |
| `analytics/schedulers/daily-cost-aggregation.ts` | 151-174 | No transaction wrapping daily+monthly updates (partial failure risk) |
| `analytics/schedulers/daily-cost-aggregation.ts` | 119-125 | Budget alerts only console.warn, no user notification sent |
| `autograde/pipeline/process-answer-grading.ts` | 82-119 | Failed questions → DLQ but no teacher notification |

---

## 6. FIRESTORE RULES AUDIT (`firestore.rules`)

### CRITICAL Issues

| Line | Issue |
|------|-------|
| 116 | `/tenants/{tenantId}` read allows `if true` — **unauthenticated access to all tenant docs** |
| 129 | `/tenantCodes/{code}` read allows `if true` — **anyone can enumerate tenant codes** |
| — | **Missing scanner role write rules** — Blueprint requires scanner write to submissions, no dedicated scanner path exists |

### HIGH Issues

| Line | Issue |
|------|-------|
| 338 | Inconsistent field: `resource.data.classId in request.auth.token.classIds` (singular classId vs plural classIds used elsewhere) |
| 459 | Chat session create: student can create without verifying `studentId` ownership or `belongsToTenant()` |
| 279-281 | `/items/{itemId}/answerKeys/{keyId}` locked to `if false` — scanner role has no access path |

### MEDIUM Issues

| Lines | Issue |
|-------|-------|
| 295, 301, 338 | Teacher/parent exam/submission access checks `classIds.hasAny()` without first verifying `belongsToTenant()` |
| 437, 441, 445 | Field naming inconsistency: `digitalTestSessions` uses `userId` while submissions use `studentId` |
| 55-58 | `canAccessClass()` checks `classIds.hasAny()` without verifying `classIds` exists in token (runtime error risk) |

### Missing Coverage

| Collection | Status |
|------------|--------|
| Scanner submission writes | MISSING — no dedicated scanner write path |
| Parent access to children's notifications | MISSING |
| Teacher class-specific exam management | PARTIAL — only checks `createdBy`, not class assignment |

### Positive Findings
- Tenant-scoped collections properly use `tenantId` path parameter
- Most rules include `belongsToTenant()` or equivalent checks
- Custom claim validation on `tenantId`
- Cloud Function-only writes for sensitive operations (memberships, notifications, answer keys)

---

## 7. TOP 10 PRIORITY FIXES

| # | Severity | Area | Fix |
|---|----------|------|-----|
| 1 | **CRITICAL** | Functions | Export `onSubmissionUpdated` and `onQuestionSubmissionUpdated` in autograde index.ts — grading pipeline is broken without them |
| 2 | **CRITICAL** | Functions | Add LLM call logging to all 5 functions that call LLM — cost tracking is completely non-functional |
| 3 | **CRITICAL** | Rules | Change `allow read: if true` to `allow read: if isAuthenticated()` for `/tenants/{tenantId}` (line 116) and `/tenantCodes/{code}` (line 129) |
| 4 | **CRITICAL** | Functions | Enable identity triggers (onUserCreated at minimum) — new signups don't get user docs |
| 5 | **HIGH** | Types | Add `LLMCallLog` type to shared-types — referenced by services but doesn't exist |
| 6 | **HIGH** | Types | Fix Teacher and Parent types — missing most blueprint fields (10 and 8 respectively) |
| 7 | **HIGH** | Functions | Implement missing identity callables: `createOrgUser`, `switchActiveTenant`, `joinTenant` |
| 8 | **HIGH** | Hooks | Implement StoryPoint, TestSession, and Chat hooks — these block core LevelUp student flows |
| 9 | **HIGH** | Hooks | Implement Space, Item, Exam, and Submission mutation hooks — these block core content/grading management |
| 10 | **HIGH** | Functions | Fix `onSubmissionCreated` to call `processAnswerMapping()` directly, not depend on disabled trigger |

---

## 8. WHAT'S WORKING WELL

- **Zustand stores** are production-ready with excellent Firebase sync and multi-tenant switching
- **AI services** (LLMWrapper, SecretManager, CostTracker) are robust with retry logic and secure key management
- **Generic Firestore/Storage/RTDB services** properly enforce tenant isolation
- **AutoGrade pipeline architecture** (Panopticon/RELMS/extraction prompts) is well-designed
- **Auth callables** provide complete type-safe wrappers for all Cloud Functions
- **React Query hooks** (where implemented) follow excellent patterns with proper caching, staleTime, and invalidation
- **Test coverage** is strong for stores and services (except consumer-store)
