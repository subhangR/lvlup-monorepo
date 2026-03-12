# V7: Admin Dashboards — Evolution Plan

**Vertical:** V7 | **Cycle:** 1 | **Team:** Platform Engineer
**Status:** Planning → Implementation
**Depends on:** V1 (Types) ✅, V2 (API) ✅, V3 (Error Handling) ✅, V4 ✅, V5 ✅

---

## Current State Assessment

### Super Admin (`apps/super-admin/`) — 9 pages exist
| Page | Status | Gaps |
|------|--------|------|
| DashboardPage | ✅ Functional | No `useApiError`, no pagination |
| TenantsPage | ✅ Functional | No pagination, no toast on create, direct httpsCallable |
| TenantDetailPage | ✅ Functional | Uses toast ✅, but direct httpsCallable |
| FeatureFlagsPage | ✅ Functional | No pagination, direct httpsCallable |
| GlobalPresetsPage | ✅ Functional | Direct httpsCallable, manual error state |
| SystemHealthPage | ✅ Functional | Type safety issues (as Error casts) |
| UserAnalyticsPage | ✅ Functional | No pagination on tenant breakdown |
| SettingsPage | ✅ Functional | Direct Firestore writes, uses toast ✅ |
| LoginPage | ✅ Functional | No changes needed |

**Missing Page:** Platform-wide LLM Usage Dashboard (scope requirement)

### Admin Web (`apps/admin-web/`) — 13 pages exist
All pages functional with shared hooks, pagination, search, bulk import, analytics.
Minimal gaps — primarily consistency improvements.

---

## V7 Implementation Scope

### Phase A: Super Admin — LLM Usage Dashboard (NEW PAGE)
- **New file:** `apps/super-admin/src/pages/LLMUsagePage.tsx`
- Aggregate AI cost data across all tenants
- Monthly cost trend chart, per-tenant usage breakdown
- Budget/quota utilization per tenant
- Add to sidebar navigation and router

### Phase B: Super Admin — Apply V3 Error Handling
- Replace inline error state management with `useApiError` hook from `@levelup/shared-hooks`
- Add sonner toast on TenantsPage create success/error
- Replace direct `httpsCallable` with shared service wrappers where available
- Fix type safety: remove `as Error` casts, use proper narrowing

### Phase C: Super Admin — Add Pagination
- Add pagination to TenantsPage (25 per page)
- Add pagination to UserAnalyticsPage tenant breakdown table
- Add pagination to FeatureFlagsPage tenant cards
- Reuse `usePagination` / `DataTablePagination` pattern from admin-web

### Phase D: Admin Web — Consistency Polish
- Verify all pages use `useApiError` for mutation error handling
- Ensure consistent loading skeleton patterns
- Verify all forms use Zod validation

---

## Acceptance Criteria
1. New LLM Usage page renders platform-wide AI cost data
2. All super-admin mutations use toast feedback (success + error)
3. All large lists have pagination (25 items/page)
4. No `any` types or unsafe casts in modified files
5. Both apps build (`pnpm build`) with zero errors
6. Both apps lint (`pnpm lint`) with zero errors
