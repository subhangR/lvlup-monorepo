/**
 * Add Students to Subhang Academy
 *
 * Adds Raghav and Vamshi as students to the existing tenant_subhang.
 * Creates:
 *   - 2 Firebase Auth users (idempotent via ensureAuthUser)
 *   - 2 /users/{uid} platform user docs
 *   - 2 /tenants/tenant_subhang/students/{entityId} entity docs
 *   - 2 /userMemberships/{uid}_{tenantId} membership docs
 *   - Custom claims for student role
 *   - Updates class studentCounts
 *   - Updates tenant stats.totalStudents
 *
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=./lvlup-ff6fa-firebase-adminsdk-fbsvc-ecf4e4fdb0.json \
 *     npx tsx scripts/seed-add-students.ts
 */

import admin from "firebase-admin";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---------------------------------------------------------------------------
// Initialize Firebase Admin (PRODUCTION)
// ---------------------------------------------------------------------------
const SERVICE_ACCOUNT_PATH = resolve(
  __dirname,
  "../lvlup-ff6fa-firebase-adminsdk-fbsvc-ecf4e4fdb0.json"
);

const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "lvlup-ff6fa",
  databaseURL: "https://lvlup-ff6fa-default-rtdb.firebaseio.com",
});

const db = admin.firestore();
const auth = admin.auth();
const FieldValue = admin.firestore.FieldValue;
const Timestamp = admin.firestore.Timestamp;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const TENANT_ID = "tenant_subhang";
const TENANT_CODE = "SUB001";
const DEFAULT_PASSWORD = "Test@12345";

const ALL_CLASS_IDS = [
  "cls_g10_sysdesign_a",
  "cls_g10_dsa_a",
  "cls_g10_lld_a",
  "cls_g10_behavioral_a",
];

const MAX_CLAIM_CLASS_IDS = 15;

const NEW_STUDENTS = [
  {
    email: "raghav@subhang.academy",
    password: DEFAULT_PASSWORD,
    displayName: "Raghav",
    firstName: "Raghav",
    lastName: "",
    rollNumber: "2026002",
    grade: "10",
    section: "A",
  },
  {
    email: "vamshi@subhang.academy",
    password: DEFAULT_PASSWORD,
    displayName: "Vamshi",
    firstName: "Vamshi",
    lastName: "",
    rollNumber: "2026003",
    grade: "10",
    section: "A",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const now = Date.now();

function ts(daysAgo = 0): admin.firestore.Timestamp {
  return Timestamp.fromMillis(now - daysAgo * 86400000);
}

async function ensureAuthUser(
  email: string,
  password: string,
  displayName: string
): Promise<string> {
  try {
    const existing = await auth.getUserByEmail(email);
    console.log(`    Auth user exists: ${email} (${existing.uid})`);
    return existing.uid;
  } catch {
    const userRecord = await auth.createUser({ email, password, displayName });
    console.log(`    Auth user created: ${email} (${userRecord.uid})`);
    return userRecord.uid;
  }
}

function buildStudentClaims(studentEntityId: string, classIds: string[]) {
  return {
    role: "student",
    tenantId: TENANT_ID,
    tenantCode: TENANT_CODE,
    studentId: studentEntityId,
    classIds: classIds.slice(0, MAX_CLAIM_CLASS_IDS),
    classIdsOverflow: classIds.length > MAX_CLAIM_CLASS_IDS,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main(): Promise<void> {
  console.log("");
  console.log("========================================");
  console.log("  Adding Students to Subhang Academy");
  console.log("========================================\n");

  // Verify tenant exists
  const tenantSnap = await db.doc(`tenants/${TENANT_ID}`).get();
  if (!tenantSnap.exists) {
    throw new Error(`Tenant ${TENANT_ID} does not exist. Run seed-subhang.ts first.`);
  }
  console.log(`  Tenant verified: ${tenantSnap.data()?.name}\n`);

  const results: Array<{
    email: string;
    uid: string;
    studentEntityId: string;
    membershipId: string;
  }> = [];

  for (const student of NEW_STUDENTS) {
    console.log(`--- Creating student: ${student.displayName} (${student.email}) ---`);

    // 1. Firebase Auth user
    const uid = await ensureAuthUser(student.email, student.password, student.displayName);

    // 2. Platform user doc: /users/{uid}
    await db.doc(`users/${uid}`).set({
      uid,
      email: student.email,
      phone: null,
      authProviders: ["email"],
      displayName: student.displayName,
      firstName: student.firstName,
      lastName: student.lastName,
      photoURL: null,
      isSuperAdmin: false,
      consumerProfile: null,
      grade: student.grade,
      status: "active",
      createdAt: ts(0),
      updatedAt: ts(0),
    });
    console.log(`    Platform user doc: /users/${uid}`);

    // 3. Student entity: /tenants/{tenantId}/students/{entityId}
    const studentEntityRef = db.collection(`tenants/${TENANT_ID}/students`).doc();
    const studentEntityId = studentEntityRef.id;

    await studentEntityRef.set({
      id: studentEntityId,
      tenantId: TENANT_ID,
      authUid: uid,
      email: student.email,
      firstName: student.firstName,
      lastName: student.lastName,
      displayName: student.displayName,
      rollNumber: student.rollNumber,
      classIds: ALL_CLASS_IDS,
      parentIds: [],
      status: "active",
      metadata: { admissionYear: "2025" },
      createdAt: ts(0),
      updatedAt: ts(0),
    });
    console.log(`    Student entity: ${studentEntityId}`);

    // 4. Membership: /userMemberships/{uid}_{tenantId}
    const membershipId = `${uid}_${TENANT_ID}`;
    await db.doc(`userMemberships/${membershipId}`).set({
      id: membershipId,
      uid,
      tenantId: TENANT_ID,
      tenantCode: TENANT_CODE,
      role: "student",
      status: "active",
      joinSource: "admin_created",
      studentId: studentEntityId,
      permissions: { managedClassIds: ALL_CLASS_IDS },
      createdAt: ts(0),
      updatedAt: ts(0),
    });
    console.log(`    Membership: ${membershipId}`);

    // 5. Custom claims
    await auth.setCustomUserClaims(uid, buildStudentClaims(studentEntityId, ALL_CLASS_IDS));
    console.log(`    Custom claims set (role=student)`);

    // 6. Update class student counts
    for (const classId of ALL_CLASS_IDS) {
      await db.doc(`tenants/${TENANT_ID}/classes/${classId}`).update({
        studentCount: FieldValue.increment(1),
      });
    }
    console.log(`    Class student counts incremented (${ALL_CLASS_IDS.length} classes)`);

    results.push({ email: student.email, uid, studentEntityId, membershipId });
    console.log("");
  }

  // 7. Update tenant stats
  await db.doc(`tenants/${TENANT_ID}`).update({
    "stats.totalStudents": FieldValue.increment(NEW_STUDENTS.length),
  });
  console.log(`  Tenant stats updated: +${NEW_STUDENTS.length} students\n`);

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------
  console.log("--- Validation ---");
  let allValid = true;

  for (const r of results) {
    // Auth user
    const userRecord = await auth.getUser(r.uid);
    const claims = userRecord.customClaims || {};
    const claimsOk = claims.role === "student" && claims.tenantId === TENANT_ID;
    console.log(
      `  [${claimsOk ? "OK" : "FAIL"}] ${r.email}: claims role=${claims.role}, tenantId=${claims.tenantId}`
    );
    if (!claimsOk) allValid = false;

    // Membership
    const mSnap = await db.doc(`userMemberships/${r.membershipId}`).get();
    console.log(`  [${mSnap.exists ? "OK" : "FAIL"}] Membership: ${r.membershipId}`);
    if (!mSnap.exists) allValid = false;

    // Student entity
    const sSnap = await db.doc(`tenants/${TENANT_ID}/students/${r.studentEntityId}`).get();
    console.log(`  [${sSnap.exists ? "OK" : "FAIL"}] Student entity: ${r.studentEntityId}`);
    if (!sSnap.exists) allValid = false;
  }

  console.log("");
  console.log(allValid ? "  ALL VALIDATIONS PASSED" : "  SOME VALIDATIONS FAILED");
  console.log("");

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log("========================================");
  console.log("  Summary");
  console.log("========================================");
  for (const r of results) {
    console.log(`  ${r.email}`);
    console.log(`    UID:        ${r.uid}`);
    console.log(`    Entity ID:  ${r.studentEntityId}`);
    console.log(`    Password:   ${DEFAULT_PASSWORD}`);
  }
  console.log("");

  // Update seed results
  const resultPath = resolve(__dirname, "seed-results/subhang.json");
  try {
    const existing = JSON.parse(readFileSync(resultPath, "utf-8"));
    existing.accounts.raghav = {
      uid: results[0].uid,
      email: results[0].email,
      role: "student",
      studentEntityId: results[0].studentEntityId,
    };
    existing.accounts.vamshi = {
      uid: results[1].uid,
      email: results[1].email,
      role: "student",
      studentEntityId: results[1].studentEntityId,
    };
    existing.credentials.raghav = { email: results[0].email, password: DEFAULT_PASSWORD };
    existing.credentials.vamshi = { email: results[1].email, password: DEFAULT_PASSWORD };
    existing.entityCounts.authUsers += 2;
    existing.entityCounts.students += 2;
    existing.entityCounts.memberships += 2;
    writeFileSync(resultPath, JSON.stringify(existing, null, 2));
    console.log(`  Results written to: ${resultPath}`);
  } catch (err) {
    console.log("  Could not update seed results file (non-fatal):", err);
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
