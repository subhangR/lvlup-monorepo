/**
 * Attach HLD Diagrams to System Design Space Items
 *
 * Uploads extracted HLD diagram PNGs to Firebase Storage and attaches them
 * as ItemAttachments to materials and questions in the HLD space.
 *
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=./lvlup-ff6fa-firebase-adminsdk-fbsvc-ecf4e4fdb0.json \
 *     npx tsx scripts/attach-hld-diagrams.ts
 */

import admin from "firebase-admin";
import { readFileSync, writeFileSync, existsSync, statSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── Constants ──
const TENANT_ID = "tenant_subhang";
const SPACE_ID = "zRMBmxWdz2yEENbwg1Ka";
const DIAGRAMS_BASE = resolve(__dirname, "../hello-interview-extract/questions");

// ── Slug → Story Point ID mapping ──
const SLUG_TO_SP: Record<string, string> = {
  "distributed-cache": "Vt1KbhgsdVC4XQhuCKO2",
  "distributed-rate-limiter": "rcaQ0ePafYPn11qsx2Ql",
  "job-scheduler": "DnYKCbEnPxDkaNPj8tKY",
  "metrics-monitoring": "Mrtmlu7UdH9HtJLXOBYe",
  "top-k": "PZKrLdpJOgmEdzktZbWh",
  "web-crawler": "nKxvgaJLUEGhxiYbDH53",
  "ad-click-aggregator": "lCyyCQmJOKlszrklMsgb",
  "fb-news-feed": "rDYQMQ9osw3TZOOZQ7sX",
  "fb-live-comments": "FhzuAqcBUyvgDr1v6nn4",
  "fb-post-search": "jfEuqPfxMxvneDJVEZtd",
  instagram: "nbQR9ReabwPddSlknkBY",
  whatsapp: "VUND1DJvaS4fI8DtjK2u",
  youtube: "oR3Qg6uIHyyUFxkCAEz1",
  dropbox: "nL2aahHoMG7cRs0wdKXy",
  "google-docs": "ktHOfg9RdXVhfZL9QOP8",
  "google-news": "vHQ0pnRtLjHwAOkkO6Gh",
  leetcode: "yVwEe3m0lLPI2SebLqTa",
  "payment-system": "zizyZf92PIQZWlVV8u7l",
  robinhood: "sUiUaHiJiMDYEXhSYTk5",
  "online-auction": "TK9Fa4LxZpRYMBNRtmVM",
  ticketmaster: "QmNyc9oTAP94sfcsR3iM",
  camelcamelcamel: "1N1is2eRDa60tzh5e87g",
  uber: "0qnGUBbRHgfgIVE4ZG35",
  tinder: "XtFgnM1G1r0SARtjGuXO",
  gopuff: "faMSL9rKs9E5aeRYGdQX",
  strava: "OU3GYGHtjJ575NBUj2Bi",
  yelp: "D8Md5sFWvjCpfKRszNzZ",
  bitly: "d8vRdRqlGMnUBFU7W2FC",
};

// ── Types ──
interface ManifestEntry {
  index: number;
  files: { png: string; svg: string };
  caption: string;
  context: string;
  svgUrl: string;
}

interface ItemAttachment {
  id: string;
  fileName: string;
  url: string;
  type: "image";
  size: number;
  mimeType: "image/png";
}

interface TopicResult {
  slug: string;
  storyPointId: string;
  diagramCount: number;
  materialsUpdated: number;
  questionsUpdated: number;
  errors: string[];
}

// ── Firebase init ──
const SERVICE_ACCOUNT_PATH = resolve(
  __dirname,
  "../lvlup-ff6fa-firebase-adminsdk-fbsvc-ecf4e4fdb0.json"
);
const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "lvlup-ff6fa",
  storageBucket: "lvlup-ff6fa.appspot.com",
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// ── Helpers ──
function generateFileId(): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).substring(2, 8);
  return `${ts}_${rand}`;
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Extract meaningful keywords from text for matching.
 * Strips common stop words and returns lowercase tokens.
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "a",
    "an",
    "the",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "can",
    "shall",
    "to",
    "of",
    "in",
    "for",
    "on",
    "with",
    "at",
    "by",
    "from",
    "as",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "between",
    "under",
    "again",
    "further",
    "then",
    "once",
    "here",
    "there",
    "when",
    "where",
    "why",
    "how",
    "all",
    "each",
    "every",
    "both",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "just",
    "but",
    "and",
    "or",
    "if",
    "while",
    "that",
    "this",
    "these",
    "those",
    "what",
    "which",
    "who",
    "whom",
    "we",
    "you",
    "he",
    "she",
    "it",
    "they",
    "them",
    "our",
    "your",
    "his",
    "her",
    "its",
    "their",
    "my",
    "me",
    "i",
    "about",
    "up",
    "out",
    "off",
    "over",
    "down",
    "also",
    "like",
    "using",
    "used",
    "use",
    "need",
    "needs",
    "make",
    "makes",
    "etc",
    "one",
    "two",
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
}

/**
 * Compute keyword overlap score between diagram metadata and question text.
 */
function matchScore(diagramCaption: string, diagramContext: string, questionText: string): number {
  const diagramWords = new Set([
    ...extractKeywords(diagramCaption),
    ...extractKeywords(diagramContext),
  ]);
  const questionWords = extractKeywords(questionText);
  let score = 0;
  for (const w of questionWords) {
    if (diagramWords.has(w)) score++;
  }
  // Boost for multi-word caption matches (e.g. "consistent hashing")
  const captionLower = diagramCaption.toLowerCase();
  if (questionText.toLowerCase().includes(captionLower) && captionLower.length > 5) {
    score += 5;
  }
  return score;
}

/**
 * Upload a PNG file to Firebase Storage and return an ItemAttachment.
 */
async function uploadDiagram(
  pngPath: string,
  itemId: string,
  fileName: string
): Promise<ItemAttachment> {
  const fileBuffer = readFileSync(pngPath);
  const fileId = generateFileId();
  const storagePath = `tenants/${TENANT_ID}/spaces/${SPACE_ID}/items/${itemId}/attachments/${fileId}_${fileName}`;

  const storageFile = bucket.file(storagePath);
  await storageFile.save(fileBuffer, {
    contentType: "image/png",
    metadata: { contentType: "image/png" },
  });
  await storageFile.makePublic();

  const url = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

  return {
    id: fileId,
    fileName,
    url,
    type: "image",
    size: fileBuffer.length,
    mimeType: "image/png",
  };
}

// ── Main ──
async function main(): Promise<void> {
  console.log("");
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║  HLD Diagram Attachment — 28 Topics                        ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log("");

  const slugs = Object.keys(SLUG_TO_SP);
  const results: TopicResult[] = [];
  let totalDiagramsUploaded = 0;
  let totalItemsUpdated = 0;

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const storyPointId = SLUG_TO_SP[slug];
    const topicResult: TopicResult = {
      slug,
      storyPointId,
      diagramCount: 0,
      materialsUpdated: 0,
      questionsUpdated: 0,
      errors: [],
    };

    console.log(`\n[${i + 1}/${slugs.length}] Processing: ${slug} (SP: ${storyPointId})`);

    // 1. Read manifest
    const manifestPath = resolve(DIAGRAMS_BASE, slug, "diagrams", "manifest.json");
    if (!existsSync(manifestPath)) {
      console.log(`  ⚠ No manifest found — skipping`);
      results.push(topicResult);
      continue;
    }

    const manifest: ManifestEntry[] = JSON.parse(readFileSync(manifestPath, "utf-8"));
    if (manifest.length === 0) {
      console.log(`  ⚠ Empty manifest — skipping`);
      results.push(topicResult);
      continue;
    }

    topicResult.diagramCount = manifest.length;
    console.log(`  Diagrams: ${manifest.length}`);

    // 2. Fetch all items for this story point
    const itemsPath = `tenants/${TENANT_ID}/spaces/${SPACE_ID}/storyPoints/${storyPointId}/items`;
    const itemsSnap = await db.collection(itemsPath).get();
    if (itemsSnap.empty) {
      console.log(`  ⚠ No items found in Firestore — skipping`);
      results.push(topicResult);
      continue;
    }

    // 3. Separate materials and questions
    const materials: admin.firestore.QueryDocumentSnapshot[] = [];
    const questions: admin.firestore.QueryDocumentSnapshot[] = [];

    for (const doc of itemsSnap.docs) {
      const data = doc.data();
      if (data.type === "material") {
        materials.push(doc);
      } else if (data.type === "question") {
        questions.push(doc);
      }
    }

    // Sort by orderIndex
    materials.sort((a, b) => (a.data().orderIndex ?? 0) - (b.data().orderIndex ?? 0));
    questions.sort((a, b) => (a.data().orderIndex ?? 0) - (b.data().orderIndex ?? 0));

    console.log(`  Items: ${materials.length} materials, ${questions.length} questions`);

    // ── 4. Attach diagrams to MATERIALS ──
    // Distribute diagrams evenly across materials
    if (materials.length > 0) {
      const diagramsPerMaterial = Math.ceil(manifest.length / materials.length);

      for (let mi = 0; mi < materials.length; mi++) {
        const mat = materials[mi];
        const startIdx = mi * diagramsPerMaterial;
        const endIdx = Math.min(startIdx + diagramsPerMaterial, manifest.length);
        const assignedDiagrams = manifest.slice(startIdx, endIdx);

        if (assignedDiagrams.length === 0) continue;

        const newAttachments: ItemAttachment[] = [];

        for (const diag of assignedDiagrams) {
          const pngPath = resolve(DIAGRAMS_BASE, slug, "diagrams", diag.files.png);
          if (!existsSync(pngPath)) {
            topicResult.errors.push(`Missing PNG: ${diag.files.png}`);
            continue;
          }

          try {
            const attachment = await uploadDiagram(pngPath, mat.id, diag.files.png);
            newAttachments.push(attachment);
            totalDiagramsUploaded++;
            await delay(300);
          } catch (err: any) {
            topicResult.errors.push(`Upload failed ${diag.files.png}: ${err.message}`);
          }
        }

        if (newAttachments.length > 0) {
          try {
            await db.doc(`${itemsPath}/${mat.id}`).update({
              attachments: admin.firestore.FieldValue.arrayUnion(...newAttachments),
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            topicResult.materialsUpdated++;
            totalItemsUpdated++;
            console.log(
              `  ✓ Material ${mi + 1}: +${newAttachments.length} diagrams (${mat.data().title?.substring(0, 40)}...)`
            );
          } catch (err: any) {
            topicResult.errors.push(
              `Firestore update failed for material ${mat.id}: ${err.message}`
            );
          }
        }
      }
    }

    // ── 5. Attach diagrams to QUESTIONS via keyword matching ──
    const questionAttachmentMap = new Map<string, ItemAttachment[]>(); // itemId -> attachments

    for (const diag of manifest) {
      const pngPath = resolve(DIAGRAMS_BASE, slug, "diagrams", diag.files.png);
      if (!existsSync(pngPath)) continue;

      // Find best matching questions
      const scored: { doc: admin.firestore.QueryDocumentSnapshot; score: number }[] = [];

      for (const qDoc of questions) {
        const qData = qDoc.data();
        const questionText = [
          qData.title || "",
          qData.content || "",
          qData.payload?.content || "",
          qData.payload?.questionData || "",
        ].join(" ");

        const score = matchScore(diag.caption, diag.context, questionText);
        if (score >= 2) {
          scored.push({ doc: qDoc, score });
        }
      }

      // Sort by score descending, take top 3 matches
      scored.sort((a, b) => b.score - a.score);
      const topMatches = scored.slice(0, 3);

      for (const match of topMatches) {
        try {
          const attachment = await uploadDiagram(pngPath, match.doc.id, diag.files.png);
          const existing = questionAttachmentMap.get(match.doc.id) || [];
          existing.push(attachment);
          questionAttachmentMap.set(match.doc.id, existing);
          totalDiagramsUploaded++;
          await delay(300);
        } catch (err: any) {
          topicResult.errors.push(
            `Upload failed ${diag.files.png} for question ${match.doc.id}: ${err.message}`
          );
        }
      }
    }

    // Write question attachments to Firestore
    let questionsUpdated = 0;
    for (const [itemId, attachments] of questionAttachmentMap) {
      try {
        await db.doc(`${itemsPath}/${itemId}`).update({
          attachments: admin.firestore.FieldValue.arrayUnion(...attachments),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        questionsUpdated++;
        totalItemsUpdated++;
      } catch (err: any) {
        topicResult.errors.push(`Firestore update failed for question ${itemId}: ${err.message}`);
      }
      await delay(200);
    }

    topicResult.questionsUpdated = questionsUpdated;
    console.log(`  ✓ Questions updated: ${questionsUpdated}`);

    if (topicResult.errors.length > 0) {
      console.log(`  ⚠ Errors: ${topicResult.errors.length}`);
    }

    results.push(topicResult);

    // Brief pause between topics
    await delay(1000);
  }

  // ── Save results ──
  const output = {
    spaceId: SPACE_ID,
    tenantId: TENANT_ID,
    totalDiagramsUploaded,
    totalItemsUpdated,
    topics: results.map(({ errors, ...rest }) => ({
      ...rest,
      errorCount: errors.length,
    })),
    completedAt: new Date().toISOString(),
  };

  const resultPath = resolve(__dirname, "seed-results/hi-hld-v2-diagrams.json");
  writeFileSync(resultPath, JSON.stringify(output, null, 2));

  console.log("\n");
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║  RESULTS                                                    ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log(`  Total diagrams uploaded: ${totalDiagramsUploaded}`);
  console.log(`  Total items updated:     ${totalItemsUpdated}`);
  console.log(`  Results saved to:        ${resultPath}`);
  console.log("");

  const errorTopics = results.filter((r) => r.errors.length > 0);
  if (errorTopics.length > 0) {
    console.log("  Topics with errors:");
    for (const t of errorTopics) {
      console.log(`    ${t.slug}: ${t.errors.length} errors`);
      for (const e of t.errors) console.log(`      - ${e}`);
    }
  }
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
