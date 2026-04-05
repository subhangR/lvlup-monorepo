/**
 * Seed LLD (Low-Level Design) Space — 17 Story Points from HelloInterview extracts
 *
 * Creates:
 *   - 1 space doc (type: hybrid, status: published, accessType: class_assigned)
 *   - 17 story points (all standard type — each is one LLD topic)
 *   - ~540 items (3 materials + 28-30 questions per story point)
 *
 * Uses existing tenant/accounts from seed-results/subhang.json
 *
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=./lvlup-ff6fa-firebase-adminsdk-fbsvc-ecf4e4fdb0.json \
 *     npx tsx scripts/seed-hi-lld.ts
 *
 * WARNING: This writes to PRODUCTION Firestore.
 */

import admin from "firebase-admin";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ── Import all 17 story point configs ──
import { lldIntroductionContent } from "./seed-configs/hi-lld/lld-introduction-content.js";
import { lldOopConceptsContent } from "./seed-configs/hi-lld/lld-oop-concepts-content.js";
import { lldDesignPrinciplesContent } from "./seed-configs/hi-lld/lld-design-principles-content.js";
import { lldPatternsContent } from "./seed-configs/hi-lld/lld-patterns-content.js";
import { lldConcurrencyIntroContent } from "./seed-configs/hi-lld/lld-concurrency-intro-content.js";
import { lldConcurrencyCorrectnessContent } from "./seed-configs/hi-lld/lld-concurrency-correctness-content.js";
import { lldConcurrencyCoordinationContent } from "./seed-configs/hi-lld/lld-concurrency-coordination-content.js";
import { lldConcurrencyScarcityContent } from "./seed-configs/hi-lld/lld-concurrency-scarcity-content.js";
import { lldElevatorContent } from "./seed-configs/hi-lld/lld-elevator-content.js";
import { lldParkingLotContent } from "./seed-configs/hi-lld/lld-parking-lot-content.js";
import { lldFileSystemContent } from "./seed-configs/hi-lld/lld-file-system-content.js";
import { lldRateLimiterContent } from "./seed-configs/hi-lld/lld-rate-limiter-content.js";
import { lldConnectFourContent } from "./seed-configs/hi-lld/lld-connect-four-content.js";
import { lldDeliveryContent } from "./seed-configs/hi-lld/lld-delivery-content.js";
import { lldAmazonLockerContent } from "./seed-configs/hi-lld/lld-amazon-locker-content.js";
import { lldBookmyshowContent } from "./seed-configs/hi-lld/lld-bookmyshow-content.js";
import { lldInventoryManagementContent } from "./seed-configs/hi-lld/lld-inventory-management-content.js";

import type { StoryPointSeed } from "./seed-configs/subhang-content.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── All 17 story points in curriculum order ──
// slug field maps to hello-interview-extract directory name for diagram attachment
const ALL_STORY_POINTS: { seed: StoryPointSeed; slug: string }[] = [
  // Foundations
  { seed: lldIntroductionContent, slug: "lld-introduction" },
  { seed: lldOopConceptsContent, slug: "lld-oop-concepts" },
  { seed: lldDesignPrinciplesContent, slug: "lld-design-principles" },
  { seed: lldPatternsContent, slug: "lld-patterns" },
  // Concurrency
  { seed: lldConcurrencyIntroContent, slug: "lld-concurrency-intro" },
  { seed: lldConcurrencyCorrectnessContent, slug: "lld-concurrency-correctness" },
  { seed: lldConcurrencyCoordinationContent, slug: "lld-concurrency-coordination" },
  { seed: lldConcurrencyScarcityContent, slug: "lld-concurrency-scarcity" },
  // Classic Problems
  { seed: lldElevatorContent, slug: "lld-elevator" },
  { seed: lldParkingLotContent, slug: "lld-parking-lot" },
  { seed: lldFileSystemContent, slug: "lld-file-system" },
  { seed: lldRateLimiterContent, slug: "lld-rate-limiter" },
  { seed: lldConnectFourContent, slug: "lld-connect-four" },
  { seed: lldDeliveryContent, slug: "lld-delivery" },
  { seed: lldAmazonLockerContent, slug: "lld-amazon-locker" },
  { seed: lldBookmyshowContent, slug: "lld-bookmyshow" },
  { seed: lldInventoryManagementContent, slug: "lld-inventory-management" },
];

// ── Constants from existing seed ──
const TENANT_ID = "tenant_subhang";
const CLASS_ID = "cls_g10_lld_a";
const ACADEMIC_SESSION_ID = "hCOHNuE19nu9187dK400";
const ADMIN_UID = "d0ZDQvoNBcTtKIIduaZvF2iiwMc2";

// ── Firebase init ──
const SERVICE_ACCOUNT_PATH = resolve(
  __dirname,
  "../lvlup-ff6fa-firebase-adminsdk-fbsvc-ecf4e4fdb0.json"
);
const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "lvlup-ff6fa",
});

const db = admin.firestore();
const Timestamp = admin.firestore.Timestamp;

const now = Date.now();
function ts(daysAgo = 0): admin.firestore.Timestamp {
  return Timestamp.fromMillis(now - daysAgo * 86400000);
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Result types ──
interface StoryPointResult {
  id: string;
  title: string;
  slug: string;
  type: string;
  itemCount: number;
}

interface SeedResult {
  spaceId: string;
  spaceTitle: string;
  tenantId: string;
  classId: string;
  storyPointCount: number;
  totalItemCount: number;
  storyPoints: StoryPointResult[];
  seededAt: string;
}

// ── Main ──
async function main(): Promise<void> {
  console.log("");
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║  LLD Space Seed — 17 Low-Level Design Interview Topics     ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log("");

  // Count total items
  let expectedTotalItems = 0;
  for (const { seed } of ALL_STORY_POINTS) expectedTotalItems += seed.items.length;
  console.log(`  Story points: ${ALL_STORY_POINTS.length}`);
  console.log(`  Total items:  ${expectedTotalItems}`);
  console.log("");

  // ═══════════════════════════════════════════════════════════════
  // Phase 1: Create the space doc
  // ═══════════════════════════════════════════════════════════════
  console.log("Phase 1: Creating LLD space...");

  const spaceRef = db.collection(`tenants/${TENANT_ID}/spaces`).doc();
  const spaceId = spaceRef.id;

  await spaceRef.set({
    id: spaceId,
    tenantId: TENANT_ID,
    title: "Low-Level Design Interview Prep (LLD)",
    description:
      "Master 17 low-level design topics — from OOP fundamentals and design patterns to concurrency and classic interview problems like Parking Lot, Elevator, and BookMyShow. Each topic includes rich study materials, deep-dive architecture notes, and 28-30 practice questions covering class design, SOLID principles, threading, and trade-offs.",
    thumbnailUrl: null,
    slug: generateSlug("Low-Level Design Interview Prep LLD"),
    type: "hybrid",
    classIds: [CLASS_ID],
    teacherIds: [ADMIN_UID],
    accessType: "class_assigned",
    subject: "Low-Level Design",
    labels: ["low-level design", "lld", "interview prep", "oop", "design patterns"],
    academicSessionId: ACADEMIC_SESSION_ID,
    defaultTimeLimitMinutes: 30,
    allowRetakes: true,
    maxRetakes: 3,
    status: "published",
    publishedAt: ts(1),
    stats: {
      totalStoryPoints: ALL_STORY_POINTS.length,
      totalItems: expectedTotalItems,
      totalStudents: 0,
      avgCompletionRate: 0,
    },
    createdBy: ADMIN_UID,
    createdAt: ts(2),
    updatedAt: ts(0),
  });

  console.log(`  Space ID: ${spaceId}`);
  console.log("");

  // ═══════════════════════════════════════════════════════════════
  // Phase 2: Seed all 17 story points + items (batched per SP)
  // ═══════════════════════════════════════════════════════════════
  console.log("Phase 2: Seeding story points and items...");

  const storyPointResults: StoryPointResult[] = [];
  let totalItemsSeeded = 0;

  for (let spi = 0; spi < ALL_STORY_POINTS.length; spi++) {
    const { seed: sp, slug } = ALL_STORY_POINTS[spi];
    const spRef = db.collection(`tenants/${TENANT_ID}/spaces/${spaceId}/storyPoints`).doc();

    const spDoc: Record<string, unknown> = {
      id: spRef.id,
      courseId: spaceId,
      spaceId,
      tenantId: TENANT_ID,
      title: sp.title,
      description: sp.description,
      orderIndex: spi,
      type: sp.type,
      sections: sp.sections,
      createdAt: ts(2),
      updatedAt: ts(0),
    };

    if (sp.assessmentConfig) {
      spDoc.assessmentConfig = sp.assessmentConfig;
    }

    // Use batched writes: 1 SP doc + all items (max ~35 per SP, well under 500 limit)
    const batch = db.batch();
    batch.set(spRef, spDoc);

    for (let ii = 0; ii < sp.items.length; ii++) {
      const item = sp.items[ii];
      const itemRef = db
        .collection(`tenants/${TENANT_ID}/spaces/${spaceId}/storyPoints/${spRef.id}/items`)
        .doc();

      const flatPayload = (item.payload as any)?.data ?? item.payload;
      const basePoints = flatPayload?.basePoints ?? 10;

      batch.set(itemRef, {
        id: itemRef.id,
        courseId: spaceId,
        storyPointId: spRef.id,
        sectionId: item.sectionId || null,
        type: item.type,
        title: item.title,
        content: flatPayload?.content || null,
        difficulty: item.difficulty || null,
        payload: flatPayload,
        meta: {
          totalPoints: item.type === "question" ? basePoints : 0,
          tags: ["low-level design", "lld"],
        },
        sect_order_idx: ii,
        orderIndex: ii,
        createdAt: ts(2),
        updatedAt: ts(0),
      });
    }

    await batch.commit();

    totalItemsSeeded += sp.items.length;
    storyPointResults.push({
      id: spRef.id,
      title: sp.title,
      slug,
      type: sp.type,
      itemCount: sp.items.length,
    });

    console.log(
      `  [${spi + 1}/${ALL_STORY_POINTS.length}] ${sp.title} — ${sp.items.length} items [${sp.type}]`
    );
  }

  console.log("");
  console.log(`  Total items seeded: ${totalItemsSeeded}`);
  console.log("");

  // ═══════════════════════════════════════════════════════════════
  // Phase 3: Validation
  // ═══════════════════════════════════════════════════════════════
  console.log("Phase 3: Validation...");

  let allPassed = true;

  // 1. Space exists
  const spaceSnap = await db.doc(`tenants/${TENANT_ID}/spaces/${spaceId}`).get();
  const spaceOk = spaceSnap.exists;
  console.log(`  [${spaceOk ? "✓" : "✗"}] Space exists: ${spaceId}`);
  if (!spaceOk) allPassed = false;

  // 2. Story point count
  const spSnap = await db.collection(`tenants/${TENANT_ID}/spaces/${spaceId}/storyPoints`).get();
  const spCountOk = spSnap.size === ALL_STORY_POINTS.length;
  console.log(
    `  [${spCountOk ? "✓" : "✗"}] Story points: ${spSnap.size}/${ALL_STORY_POINTS.length}`
  );
  if (!spCountOk) allPassed = false;

  // 3. Item counts per story point
  let totalValidatedItems = 0;
  for (const spDoc of spSnap.docs) {
    const itemsSnap = await db
      .collection(`tenants/${TENANT_ID}/spaces/${spaceId}/storyPoints/${spDoc.id}/items`)
      .get();
    totalValidatedItems += itemsSnap.size;
  }
  const itemCountOk = totalValidatedItems === expectedTotalItems;
  console.log(
    `  [${itemCountOk ? "✓" : "✗"}] Total items: ${totalValidatedItems}/${expectedTotalItems}`
  );
  if (!itemCountOk) allPassed = false;

  console.log("");
  console.log(
    allPassed ? "  ✅ ALL VALIDATIONS PASSED" : "  ⚠️  SOME VALIDATIONS FAILED — check output above"
  );
  console.log("");

  // ═══════════════════════════════════════════════════════════════
  // Save result
  // ═══════════════════════════════════════════════════════════════
  const result: SeedResult = {
    spaceId,
    spaceTitle: "Low-Level Design Interview Prep (LLD)",
    tenantId: TENANT_ID,
    classId: CLASS_ID,
    storyPointCount: ALL_STORY_POINTS.length,
    totalItemCount: totalItemsSeeded,
    storyPoints: storyPointResults,
    seededAt: new Date().toISOString(),
  };

  const resultPath = resolve(__dirname, "seed-results/hi-lld.json");
  writeFileSync(resultPath, JSON.stringify(result, null, 2));
  console.log(`  Result saved to: ${resultPath}`);
  console.log("");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
