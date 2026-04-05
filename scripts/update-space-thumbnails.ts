/**
 * Update Space Thumbnails — Subhang Academy
 *
 * Sets thumbnailUrl for all 7 spaces in tenant_subhang using
 * high-quality Unsplash stock photos (free, no attribution required).
 *
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=./lvlup-ff6fa-firebase-adminsdk-fbsvc-ecf4e4fdb0.json \
 *     npx tsx scripts/update-space-thumbnails.ts
 */

import admin from "firebase-admin";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---------------------------------------------------------------------------
// Initialize Firebase Admin
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Space → Thumbnail mapping
// ---------------------------------------------------------------------------
const TENANT_ID = "tenant_subhang";

const SPACE_THUMBNAILS: Record<string, { title: string; thumbnailUrl: string }> = {
  // Original 4 spaces (from seed-subhang.ts)
  "8rPWlVP4kyDp1xd75SnH": {
    title: "System Design",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&q=80",
    // Blue-lit data center corridor — represents distributed systems & architecture
  },
  ZikR8xEHkqIaIsugmdQg: {
    title: "Data Structures & Algorithms",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=400&fit=crop&q=80",
    // Colorful code/programming visualization — represents algorithms & coding
  },
  XTw3bLqiT4dMyvFJkI0g: {
    title: "Low-Level Design & OOP",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=400&fit=crop&q=80",
    // Code on dark screen with syntax highlighting — represents design patterns & OOP
  },
  "1AqFwKSf59FiIrqzaQ7i": {
    title: "Behavioral Interview Mastery",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=400&fit=crop&q=80",
    // Professional handshake — represents interviews & career development
  },

  // Additional spaces (from seed-ddd, seed-ddia, seed-java)
  mjOdVfY9E1euZpUTITde: {
    title: "Domain-Driven Design (Eric Evans)",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&h=400&fit=crop&q=80",
    // Library with books — represents the DDD book study
  },
  zVxbF1tyGRh6v3Ls2Lpl: {
    title: "Designing Data-Intensive Applications",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&q=80",
    // Earth from space with glowing data connections — represents distributed data systems
  },
  ttKd1Z2CKIhl4ZjZ0PKJ: {
    title: "Java Programming",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop&q=80",
    // Laptop with code on screen — represents Java programming
  },
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║  Updating Space Thumbnails — Subhang Academy               ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  let updated = 0;
  let skipped = 0;

  for (const [spaceId, { title, thumbnailUrl }] of Object.entries(SPACE_THUMBNAILS)) {
    const spaceRef = db.doc(`tenants/${TENANT_ID}/spaces/${spaceId}`);
    const snap = await spaceRef.get();

    if (!snap.exists) {
      console.log(`  ⚠ SKIP: "${title}" (${spaceId}) — not found in Firestore`);
      skipped++;
      continue;
    }

    await spaceRef.update({ thumbnailUrl });
    console.log(`  ✓ Updated: "${title}" (${spaceId})`);
    updated++;
  }

  console.log(`\n  Done! Updated: ${updated}, Skipped: ${skipped}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
