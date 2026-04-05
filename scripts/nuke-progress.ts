/**
 * Nuke all progress data from RTDB and Firestore.
 *
 * Deletes:
 *   RTDB:      /leaderboards, /practice
 *   Firestore: tenants/{tenantId}/spaceProgress/*
 *              tenants/{tenantId}/studentProgressSummaries/*
 *              tenants/{tenantId}/digitalTestSessions/*
 *
 * Does NOT touch: spaces, storyPoints, items, users, tenants, or any other data.
 *
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=./lvlup-ff6fa-firebase-adminsdk-fbsvc-ecf4e4fdb0.json \
 *     npx tsx scripts/nuke-progress.ts
 */

import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://lvlup-ff6fa-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const db = admin.firestore();
const rtdb = admin.database();

async function deleteCollection(collectionRef: admin.firestore.CollectionReference, label: string) {
  let deleted = 0;
  const batchSize = 400;
  while (true) {
    const snap = await collectionRef.limit(batchSize).get();
    if (snap.empty) break;
    const batch = db.batch();
    snap.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    deleted += snap.size;
    process.stdout.write(`  ${label}: deleted ${deleted} docs so far\r`);
  }
  console.log(`  ${label}: deleted ${deleted} docs total`);
}

async function main() {
  console.log("=== Nuking all progress data ===\n");

  // ── RTDB ──
  console.log("[RTDB] Removing /leaderboards ...");
  await rtdb.ref("leaderboards").remove();
  console.log("[RTDB] /leaderboards removed.");

  console.log("[RTDB] Removing /practice ...");
  await rtdb.ref("practice").remove();
  console.log("[RTDB] /practice removed.\n");

  // ── Firestore ──
  console.log("[Firestore] Finding all tenants ...");
  const tenantsSnap = await db.collection("tenants").get();
  const tenantIds = tenantsSnap.docs.map((d) => d.id);
  console.log(`  Found ${tenantIds.length} tenant(s): ${tenantIds.join(", ")}\n`);

  const subcollections = ["spaceProgress", "studentProgressSummaries", "digitalTestSessions"];

  for (const tenantId of tenantIds) {
    console.log(`[Firestore] Tenant: ${tenantId}`);
    for (const sub of subcollections) {
      const ref = db.collection(`tenants/${tenantId}/${sub}`);
      await deleteCollection(ref, sub);
    }
    console.log("");
  }

  console.log("=== Done. All progress data nuked. ===");
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
