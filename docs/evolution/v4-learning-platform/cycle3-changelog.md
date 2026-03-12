# V4+V5+V6 Cycle 3 Changelog

## Summary

Cycle 3 delivers 7 features across V4 (Learning Platform), V5 (AutoGrade & AI), and V6 (Digital Testing) to bring core experience verticals closer to production-grade quality.

---

## V4 — Learning Platform & Content Engine

### 4.1 Content Versioning Types
- Added `version?: number` field to `Space` and `UnifiedItem` types
- Added `ContentVersion` interface for tracking revision history snapshots
- Collection path: `/tenants/{tenantId}/spaces/{spaceId}/versions/{versionId}`
- Exported `ContentVersion` from `@levelup/shared-types`

**Files modified:**
- `packages/shared-types/src/levelup/space.ts` — Added `version`, `ratingAggregate`, `ContentVersion`
- `packages/shared-types/src/content/item.ts` — Added `version` to `UnifiedItem`
- `packages/shared-types/src/levelup/index.ts` — Exported `ContentVersion`, `SpaceReview`, `SpaceRatingAggregate`

### 4.2 Space Rating & Review System
- Students can rate spaces 1-5 stars with optional text comments
- One review per user per space (update on re-submit)
- Denormalized `SpaceRatingAggregate` stored on Space document for fast reads
- Average rating displayed on space cards in SpacesListPage
- Full review section with star rating UI in SpaceViewerPage
- Backend callable `saveSpaceReview` handles create/update and aggregate recomputation

**Files created:**
- `packages/shared-types/src/levelup/space-review.ts` — `SpaceReview`, `SpaceRatingAggregate` types
- `packages/shared-hooks/src/queries/useSpaceReviews.ts` — `useSpaceReviews`, `useSaveSpaceReview` hooks
- `functions/levelup/src/callable/save-space-review.ts` — Backend callable
- `apps/student-web/src/components/spaces/SpaceReviewSection.tsx` — Review UI component

**Files modified:**
- `packages/shared-types/src/levelup/space.ts` — Added `ratingAggregate` to `Space`
- `packages/shared-hooks/src/queries/index.ts` — Exported review hooks
- `functions/levelup/src/index.ts` — Exported `saveSpaceReview`
- `apps/student-web/src/pages/SpaceViewerPage.tsx` — Integrated review section
- `apps/student-web/src/pages/SpacesListPage.tsx` — Show rating on space cards

### 4.3 Enhanced Error & Empty States
- SpacesListPage: Added error state with retry button, improved empty state messaging
- SpaceViewerPage: Added error state with retry, improved "not found" state with back navigation

**Files modified:**
- `apps/student-web/src/pages/SpacesListPage.tsx` — Error boundary, retry, descriptive empty state
- `apps/student-web/src/pages/SpaceViewerPage.tsx` — Error state, improved not-found

---

## V5 — AutoGrade & AI Pipeline

### 5.1 Grading Audit Trail UI
- Override history now shows original vs new score with strikethrough
- Timestamp display for when override was applied
- History icon indicator for audit trail visibility

**Files modified:**
- `apps/teacher-web/src/pages/exams/GradingReviewPage.tsx` — Enhanced override display with timeline

### 5.2 Retry Failed Questions UI
- "Retry AI Grading" button for failed and needs_review questions
- Calls existing `gradeQuestion` callable in `retry` mode
- Reloads question submissions after retry to reflect updated state
- Button disabled during retry operation

**Files modified:**
- `apps/teacher-web/src/pages/exams/GradingReviewPage.tsx` — Added retry handler and button

---

## V6 — Digital Testing & Assessment

### 6.1 Class-Level Test Analytics for Teachers
- New `ClassTestAnalyticsPage` with class selector
- Class overview: total exams, learning spaces, avg pass rate, avg score
- Exam deep dive: submissions, avg score, pass rate, graded count
- Weak topics alert banner highlighting topics below 50%
- Score distribution histogram with color-coded buckets
- Per-question analysis table with difficulty, discrimination index, common mistakes

**Files created:**
- `apps/teacher-web/src/pages/ClassTestAnalyticsPage.tsx` — Full page component

**Files modified:**
- `apps/teacher-web/src/App.tsx` — Added route `/analytics/tests`

### 6.2 Question Bank → Test Import Enhancement
- "Import from Bank" button added to space editor content tab (per story point)
- QuestionBankImportDialog with search, multi-select, and batch import
- Shows question type, difficulty, subject, and usage count for each question
- Calls existing `importFromBank` backend callable
- Auto-reloads items after import

**Files created:**
- `apps/teacher-web/src/components/spaces/QuestionBankImportDialog.tsx` — Import dialog component

**Files modified:**
- `apps/teacher-web/src/pages/spaces/SpaceEditorPage.tsx` — Added import button and dialog integration

---

## Build Status

- `pnpm build --filter=@levelup/shared-types` — PASS
- `pnpm --filter=student-web exec -- tsc --noEmit` — PASS (0 errors)
- `pnpm --filter=teacher-web exec -- tsc --noEmit` — PASS (0 errors)
- `pnpm --filter=functions-levelup exec -- tsc --noEmit` — PASS (0 errors)

## Files Summary

| Category | Created | Modified |
|----------|---------|----------|
| Types | 1 | 3 |
| Hooks | 1 | 1 |
| Functions | 1 | 1 |
| Student-Web | 1 | 2 |
| Teacher-Web | 2 | 2 |
| **Total** | **6** | **9** |
