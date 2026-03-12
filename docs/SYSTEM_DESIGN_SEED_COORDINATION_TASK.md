# System Design Seed Data & E2E Test Pipeline — Coordination Task

Coordinate the 4 seed pipeline team members to execute the full System Design course seeding and E2E testing as defined in `docs/SEED_DATA_AND_E2E_TEST_PLAN.md`.

## Team Members

| # | Member | ID | Responsibility |
|---|--------|----|----------------|
| 1 | 🏛️ Tenant & Account Engineer | `tm_1772922038216_e0k3oiemi` | Create tenant, auth users, accounts, classes, memberships |
| 2 | 📦 Content & Space Architect | `tm_1772922052955_3peijd130` | Design System Design space, 4 story points, 32 items (AI-generated) |
| 3 | ⚙️ Seed Orchestrator | `tm_1772922065579_s327d22bu` | Build seed script, execute seeding, validate data integrity |
| 4 | ✅ QA & Validation Engineer | `tm_1772922078084_421h81fb2` | Auto-generate Playwright E2E tests, run across all 5 apps |

---

## Phase 1: Account & Tenant Creation (🏛️ Tenant & Account Engineer)

### 1.1 Tenant
| Field | Value |
|-------|-------|
| Tenant Name | Subhang Academy |
| Tenant ID | tenant_subhang |
| Tenant Code | SUB001 |
| Owner Email | subhang.rocklee@gmail.com |
| Status | active |
| Plan | premium |

### 1.2 Academic Session
- Name: 2025-26 (current)

### 1.3 Accounts

**School Admin (Tenant Admin):**
- Email: subhang.rocklee@gmail.com | Password: Test@12345
- Role: tenantAdmin | Display Name: Subhang
- Reuses same Firebase Auth UID as tenant owner
- Create `/userMemberships/{uid}_tenant_subhang` with role `tenantAdmin`
- Set custom claims: `{ role: 'tenantAdmin', tenantId: 'tenant_subhang', tenantCode: 'SUB001' }`

**Teacher (same user, multi-role):**
- Email: subhang.rocklee@gmail.com | Role: teacher
- Display Name: Subhang | Department: Computer Science | Subjects: System Design, Software Architecture
- Same Firebase Auth UID (multi-role user)
- Create `/tenants/tenant_subhang/teachers/{teacherId}`
- Update membership to include teacherId

**Student (Test Account):**
- Email: student.test@subhang.academy | Password: Test@12345
- Role: student | Display Name: Test Student
- Roll Number: 2026001 | Grade: 10 | Section: A
- Create new Firebase Auth user
- Create `/tenants/tenant_subhang/students/{studentId}`
- Create `/userMemberships/{uid}_tenant_subhang` with role student
- Custom claims: `{ role: 'student', tenantId: 'tenant_subhang', tenantCode: 'SUB001', studentId: '...' }`

**Parent (Test Account):**
- Email: parent.test@subhang.academy | Password: Test@12345
- Role: parent | Display Name: Test Parent | Linked Student: Test Student
- Create new Firebase Auth user
- Create `/tenants/tenant_subhang/parents/{parentId}` with `studentIds: [studentId]`
- Custom claims: `{ role: 'parent', tenantId: 'tenant_subhang', tenantCode: 'SUB001', parentId: '...' }`

### 1.4 Class
- Name: System Design Class | Grade: 10 | Section: A
- Teacher: Subhang (from teacher above)
- Students: Test Student (from student above)
- Create `/tenants/tenant_subhang/classes/{classId}`

---

## Phase 2: Space & Content Creation (📦 Content & Space Architect)

### 2.1 Space Configuration
| Field | Value |
|-------|-------|
| Title | System Design |
| Slug | system-design |
| Description | Master the fundamentals of system design, covering scalability, databases, caching, load balancing, and distributed architectures through theory, practice, quizzes, and timed assessments. |
| Type | hybrid |
| Subject | Computer Science |
| Access Type | class_assigned |
| Class IDs | [classId from Phase 1] |
| Teacher IDs | [teacherId from Phase 1] |
| Status | published |

### 2.2 Story Point 1: "Fundamentals of Scalability" — Type: `standard`
- Sections: Theory & Concepts (`sec_theory`), Practice Questions (`sec_practice`)
- 8 Items:
  1. **[Material - Rich]** "Introduction to Scalability" — theory content on horizontal vs vertical scaling, CAP theorem
  2. **[Material - Video]** "Scalability Deep Dive" — embedded YouTube link
  3. **[Question - MCQ]** "Which type of scaling adds more machines?" — Horizontal (correct) | 10pts easy
  4. **[Question - True/False]** "CAP theorem states you can have all three" — false | 10pts easy
  5. **[Question - MCAQ]** "Select all benefits of horizontal scaling" — fault tolerance (✓), linear cost (✓) | 15pts medium
  6. **[Question - Numerical]** "4 servers × 1000 req/s" — 4000 | 10pts easy
  7. **[Question - Fill Blanks]** "The _____ theorem states..." — CAP | 10pts medium
  8. **[Question - Paragraph]** "Explain trade-offs horizontal vs vertical" — AI-evaluatable | 25pts hard

### 2.3 Story Point 2: "Database Design & Patterns" — Type: `practice`
- Sections: Key Concepts (`sec_concepts`), Practice Exercises (`sec_exercises`), Advanced Patterns (`sec_advanced`)
- 8 Items:
  1. **[Material - Rich]** "SQL vs NoSQL Decision Guide" — comparison table
  2. **[MCQ]** "Best DB for complex joins?" — PostgreSQL (✓) | 10pts easy
  3. **[Matching]** "Match DB to use case" — Redis→Caching, PostgreSQL→Relational, MongoDB→Documents, Cassandra→Time-series | 20pts medium
  4. **[MCAQ]** "Valid sharding strategies" — Hash (✓), Range (✓), Directory (✓), Random (✗) | 15pts medium
  5. **[Text]** "What is denormalization?" — AI-evaluatable | 15pts medium
  6. **[MCQ]** "Primary benefit of replication?" — High availability (✓) | 10pts easy
  7. **[True/False]** "Master-slave: writes go to slave" — false | 10pts easy
  8. **[Paragraph]** "Design a Twitter DB schema" — AI-evaluatable | 30pts hard

### 2.4 Story Point 3: "Caching & Load Balancing Quiz" — Type: `quiz`
- Assessment: maxAttempts=3, shuffle=true, showResultsImmediately=true, passingPercentage=60
- Sections: Caching Questions (`sec_caching`), Load Balancing Questions (`sec_lb`)
- 8 Items: MCQ×4, TF×1, Fill-blanks×1, MCAQ×1, Jumbled×1 (see SEED_DATA_AND_E2E_TEST_PLAN.md for full details)

### 2.5 Story Point 4: "System Design Assessment" — Type: `timed_test`
- Assessment: duration=30min, maxAttempts=1, shuffle=true, showResultsImmediately=false, passingPercentage=50
- Sections: Multiple Choice (`sec_mcq`), Design Questions (`sec_design`)
- 8 Items: MCQ×3, TF×1, Numerical×1, Paragraph×2, Text×1 (see SEED_DATA_AND_E2E_TEST_PLAN.md)

---

## Phase 3: Seed Script & Execution (⚙️ Seed Orchestrator)

1. Create `scripts/seed-subhang.ts` combining outputs from Phase 1 (accounts) and Phase 2 (content)
2. Use Firebase Admin SDK connecting to production Firestore (`lvlup-ff6fa`)
3. Follow `seed-production.ts` patterns (ensureAuthUser, BatchWriter, buildClaimsForMembership)
4. Entity creation order: Auth users → /users → /tenants → /tenantCodes → academicSessions → teachers → students → parents → classes → memberships → custom claims → space → storyPoints → items
5. Set space status to `published` for student visibility
6. Log all created IDs
7. Write results to `scripts/seed-results/subhang.json` for test consumption
8. Execute: `GOOGLE_APPLICATION_CREDENTIALS=./lvlup-ff6fa-firebase-adminsdk-fbsvc-ecf4e4fdb0.json npx tsx scripts/seed-subhang.ts`
9. Post-seed validation: verify auth users exist, custom claims set, all sub-collections populated, space is published

---

## Phase 4: E2E Testing (✅ QA & Validation Engineer)

### 4.1 Pre-test Setup
- Add credentials to `tests/e2e/helpers/selectors.ts`
- Import seed results from `scripts/seed-results/subhang.json`
- Create `tests/e2e/system-design-e2e.spec.ts`

### 4.2 Test Scenarios (~30-35 tests)

| App | Port | Tests | Key Verifications |
|-----|------|-------|-------------------|
| Super Admin | 4567 | 4 | Tenant in list, details, stats |
| Admin Web | 4568 | 8 | Dashboard, classes, teachers, students, parents, spaces, story points |
| Teacher Web | 4569 | 9 | Space visible, all 4 SP types, item rendering |
| Student Web | 4570 | 16 | Space browse, answer MCQ/TF/numerical, quiz mode, timed test, progress |
| Parent Web | 4571 | 5 | Linked student, progress, points/completion |

### 4.3 Cross-App Consistency
- Tenant visible across all apps
- Space visible in admin, teacher, student, parent (progress)
- Student scores consistent across student results, teacher analytics, parent progress

### 4.4 Execution Commands
```bash
pnpm run test:e2e -- --grep "System Design"
# Per-app: pnpm run test:e2e:{super-admin|admin-web|teacher-web|student-web|parent-web} -- --grep "Subhang"
```

---

## Orchestration Sequence

```
Phase 1 & 2 (PARALLEL — no dependencies between them):
  🏛️ Tenant & Account Engineer → account/tenant config & code
  📦 Content & Space Architect → space/content config & code
         ↓ both complete
Phase 3 (SEQUENTIAL — depends on Phase 1 + 2):
  ⚙️ Seed Orchestrator → merge configs → build seed-subhang.ts → execute → validate
         ↓ seed complete + validated
Phase 4 (SEQUENTIAL — depends on Phase 3):
  ✅ QA & Validation Engineer → generate tests from seed results → run all 5 apps → report
```

## Success Criteria
1. All 3 auth users created (admin/teacher shared UID + student + parent)
2. ~50+ Firestore documents created
3. All 4 story point types covered (standard, practice, quiz, timed_test)
4. 9 question types tested (MCQ, MCAQ, TF, numerical, fill-blanks, matching, jumbled, text, paragraph)
5. ~30-35 Playwright tests pass across all 5 apps
6. Cross-app data consistency verified
7. Seed results JSON written for future test reuse
