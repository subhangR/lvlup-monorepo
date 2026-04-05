/**
 * Seed HLD (System Design) Space — 28 Story Points from HelloInterview extracts
 *
 * Creates:
 *   - 1 space doc (type: hybrid, status: published, accessType: class_assigned)
 *   - 28 story points (all standard type — each is one system design problem)
 *   - ~924 items (3 materials + 30 questions per story point)
 *
 * Uses existing tenant/accounts from seed-results/subhang.json
 *
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=./lvlup-ff6fa-firebase-adminsdk-fbsvc-ecf4e4fdb0.json \
 *     npx tsx scripts/seed-hi-hld.ts
 *
 * WARNING: This writes to PRODUCTION Firestore.
 */

import admin from "firebase-admin";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ── Import all 28 story point configs ──
import { adClickAggregatorContent } from "./seed-configs/hi-hld/ad-click-aggregator-content.js";
import { bitlyContent } from "./seed-configs/hi-hld/bitly-content.js";
import { camelcamelcamelContent } from "./seed-configs/hi-hld/camelcamelcamel-content.js";
import { distributedCacheContent } from "./seed-configs/hi-hld/distributed-cache-content.js";
import { distributedRateLimiterContent } from "./seed-configs/hi-hld/distributed-rate-limiter-content.js";
import { dropboxContent } from "./seed-configs/hi-hld/dropbox-content.js";
import { fbLiveCommentsContent } from "./seed-configs/hi-hld/fb-live-comments-content.js";
import { fbNewsFeedContent } from "./seed-configs/hi-hld/fb-news-feed-content.js";
import { fbPostSearchContent } from "./seed-configs/hi-hld/fb-post-search-content.js";
import { googleDocsContent } from "./seed-configs/hi-hld/google-docs-content.js";
import { googleNewsContent } from "./seed-configs/hi-hld/google-news-content.js";
import { gopuffContent } from "./seed-configs/hi-hld/gopuff-content.js";
import { instagramContent } from "./seed-configs/hi-hld/instagram-content.js";
import { jobSchedulerContent } from "./seed-configs/hi-hld/job-scheduler-content.js";
import { leetcodeContent } from "./seed-configs/hi-hld/leetcode-content.js";
import { metricsMonitoringContent } from "./seed-configs/hi-hld/metrics-monitoring-content.js";
import { onlineAuctionContent } from "./seed-configs/hi-hld/online-auction-content.js";
import { paymentSystemContent } from "./seed-configs/hi-hld/payment-system-content.js";
import { robinhoodContent } from "./seed-configs/hi-hld/robinhood-content.js";
import { stravaContent } from "./seed-configs/hi-hld/strava-content.js";
import { ticketmasterContent } from "./seed-configs/hi-hld/ticketmaster-content.js";
import { tinderContent } from "./seed-configs/hi-hld/tinder-content.js";
import { topKContent } from "./seed-configs/hi-hld/top-k-content.js";
import { uberContent } from "./seed-configs/hi-hld/uber-content.js";
import { webCrawlerContent } from "./seed-configs/hi-hld/web-crawler-content.js";
import { whatsappContent } from "./seed-configs/hi-hld/whatsapp-content.js";
import { yelpContent } from "./seed-configs/hi-hld/yelp-content.js";
import { youtubeContent } from "./seed-configs/hi-hld/youtube-content.js";

import type { StoryPointSeed } from "./seed-configs/subhang-content.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── All 28 story points in order ──
const ALL_STORY_POINTS: StoryPointSeed[] = [
  // Infrastructure / Foundations
  distributedCacheContent,
  distributedRateLimiterContent,
  jobSchedulerContent,
  metricsMonitoringContent,
  topKContent,
  webCrawlerContent,
  adClickAggregatorContent,
  // Social / Communication
  fbNewsFeedContent,
  fbLiveCommentsContent,
  fbPostSearchContent,
  instagramContent,
  whatsappContent,
  // Content Platforms
  youtubeContent,
  dropboxContent,
  googleDocsContent,
  googleNewsContent,
  leetcodeContent,
  // Commerce / Finance
  paymentSystemContent,
  robinhoodContent,
  onlineAuctionContent,
  ticketmasterContent,
  camelcamelcamelContent,
  // Location / Delivery
  uberContent,
  tinderContent,
  gopuffContent,
  stravaContent,
  yelpContent,
  // Utility
  bitlyContent,
];

// ── Constants from existing seed ──
const TENANT_ID = "tenant_subhang";
const CLASS_ID = "cls_g10_sysdesign_a";
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
  console.log("║  HLD V2 Space Seed — 28 System Design Interview Problems    ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log("");

  // Count total items
  let expectedTotalItems = 0;
  for (const sp of ALL_STORY_POINTS) expectedTotalItems += sp.items.length;
  console.log(`  Story points: ${ALL_STORY_POINTS.length}`);
  console.log(`  Total items:  ${expectedTotalItems}`);
  console.log("");

  // ═══════════════════════════════════════════════════════════════
  // Phase 1: Create the space doc
  // ═══════════════════════════════════════════════════════════════
  console.log("Phase 1: Creating HLD space...");

  const spaceRef = db.collection(`tenants/${TENANT_ID}/spaces`).doc();
  const spaceId = spaceRef.id;

  await spaceRef.set({
    id: spaceId,
    tenantId: TENANT_ID,
    title: "System Design Interview Prep V2 (HLD)",
    description:
      "Master 28 real system design interview problems — from Tinder and Uber to distributed caches and payment systems. V2 features improved sub-topic sections and randomized answer positions. Each topic includes rich study materials, deep-dive architecture notes, and 30+ practice questions covering requirements, API design, data models, scaling strategies, and trade-offs.",
    thumbnailUrl: null,
    slug: generateSlug("System Design Interview Prep V2 HLD"),
    type: "hybrid",
    classIds: [CLASS_ID],
    teacherIds: [ADMIN_UID],
    accessType: "class_assigned",
    subject: "System Design",
    labels: ["system design", "hld", "interview prep"],
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
  // Phase 2: Seed all 28 story points + items (batched per SP)
  // ═══════════════════════════════════════════════════════════════
  console.log("Phase 2: Seeding story points and items...");

  const storyPointResults: StoryPointResult[] = [];
  let totalItemsSeeded = 0;

  for (let spi = 0; spi < ALL_STORY_POINTS.length; spi++) {
    const sp = ALL_STORY_POINTS[spi];
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
          tags: ["system design", "hld"],
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
    spaceTitle: "System Design Interview Prep V2 (HLD)",
    tenantId: TENANT_ID,
    classId: CLASS_ID,
    storyPointCount: ALL_STORY_POINTS.length,
    totalItemCount: totalItemsSeeded,
    storyPoints: storyPointResults,
    seededAt: new Date().toISOString(),
  };

  const resultPath = resolve(__dirname, "seed-results/hi-hld-v2.json");
  writeFileSync(resultPath, JSON.stringify(result, null, 2));
  console.log(`  Result saved to: ${resultPath}`);
  console.log("");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
