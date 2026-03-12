import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { assertAuth, assertTenantMember } from '../utils/auth';
import { RecordItemAttemptRequestSchema } from '@levelup/shared-types';
import type { ItemProgressEntry, ProgressStatus } from '@levelup/shared-types';
import { parseRequest } from '../utils';
import { enforceRateLimit } from '../utils/rate-limit';

/** Extended progress entry that includes storyPointId for per-storyPoint aggregation. */
interface StoredItemProgressEntry extends ItemProgressEntry {
  storyPointId: string;
}

interface RecordItemAttemptRequest {
  tenantId: string;
  spaceId: string;
  storyPointId: string;
  itemId: string;
  itemType: string;
  score: number;
  maxScore: number;
  correct: boolean;
  timeSpent?: number;
  feedback?: string;
}

/**
 * Record an item attempt for non-test items (standard storyPoints, practice, etc.).
 * Updates SpaceProgress with best score tracking.
 */
export const recordItemAttempt = onCall(
  { region: 'asia-south1', cors: true },
  async (request) => {
    const callerUid = assertAuth(request.auth);
    const data = parseRequest(request.data, RecordItemAttemptRequestSchema);

    if (!data.tenantId || !data.spaceId || !data.storyPointId || !data.itemId) {
      throw new HttpsError(
        'invalid-argument',
        'tenantId, spaceId, storyPointId, and itemId are required',
      );
    }

    await assertTenantMember(callerUid, data.tenantId);
    await enforceRateLimit(data.tenantId, callerUid, 'write', 30);

    const db = admin.firestore();
    const progressId = `${callerUid}_${data.spaceId}`;
    const progressRef = db.doc(`tenants/${data.tenantId}/spaceProgress/${progressId}`);
    const progressDoc = await progressRef.get();

    const now = Date.now();
    const existingItems = progressDoc.exists ? progressDoc.data()?.items ?? {} : {};
    const existingEntry = existingItems[data.itemId];

    // Keep best score
    const previousBest = existingEntry?.questionData?.bestScore ?? 0;
    const bestScore = Math.max(data.score, previousBest);
    const attemptsCount = (existingEntry?.questionData?.attemptsCount ?? 0) + 1;

    const itemEntry = {
      itemId: data.itemId,
      storyPointId: data.storyPointId,
      itemType: data.itemType || 'question',
      completed: data.correct || bestScore > 0,
      completedAt: data.correct ? now : existingEntry?.completedAt ?? null,
      timeSpent: (existingEntry?.timeSpent ?? 0) + (data.timeSpent ?? 0),
      interactions: attemptsCount,
      lastUpdatedAt: now,
      questionData: {
        status: data.correct
          ? 'correct'
          : data.score > 0
            ? 'partial'
            : 'incorrect',
        attemptsCount,
        bestScore,
        pointsEarned: bestScore,
        totalPoints: data.maxScore,
        percentage: data.maxScore > 0 ? (bestScore / data.maxScore) * 100 : 0,
        solved: data.correct,
      },
      feedback: data.feedback ?? existingEntry?.feedback ?? null,
    };

    // Merge into progress
    const mergedItems = { ...existingItems, [data.itemId]: itemEntry };

    // Recompute overall aggregates
    let totalPointsEarned = 0;
    let totalPointsAvailable = 0;
    for (const entry of Object.values(mergedItems) as StoredItemProgressEntry[]) {
      if (entry.questionData) {
        totalPointsEarned += entry.questionData.bestScore ?? 0;
        totalPointsAvailable += entry.questionData.totalPoints ?? 0;
      }
    }

    const overallPercentage = totalPointsAvailable > 0
      ? totalPointsEarned / totalPointsAvailable
      : 0;

    // Compute per-storyPoint aggregates by filtering items for this storyPoint
    let spPointsEarned = 0;
    let spPointsAvailable = 0;
    for (const entry of Object.values(mergedItems) as StoredItemProgressEntry[]) {
      if (entry.questionData && entry.storyPointId === data.storyPointId) {
        spPointsEarned += entry.questionData.bestScore ?? 0;
        spPointsAvailable += entry.questionData.totalPoints ?? 0;
      }
    }

    const spPercentage = spPointsAvailable > 0
      ? spPointsEarned / spPointsAvailable
      : 0;

    // --- StoryPoint completion detection ---
    // Check if all items in this storyPoint are completed
    let storyPointStatus: ProgressStatus = 'in_progress';
    let storyPointCompletedAt: number | undefined;
    try {
      const storyPointDoc = await db
        .doc(`tenants/${data.tenantId}/spaces/${data.spaceId}/storyPoints/${data.storyPointId}`)
        .get();

      if (storyPointDoc.exists) {
        const spData = storyPointDoc.data();
        const totalItemsInSP = spData?.stats?.totalItems ?? 0;

        if (totalItemsInSP > 0) {
          // Count completed items for this storyPoint from merged progress
          let completedItemCount = 0;
          for (const entry of Object.values(mergedItems) as StoredItemProgressEntry[]) {
            if (entry.storyPointId === data.storyPointId && entry.completed) {
              completedItemCount++;
            }
          }

          if (completedItemCount >= totalItemsInSP) {
            storyPointStatus = 'completed';
            // Use existing completedAt if already set, otherwise set now
            const existingSPProgress = progressDoc.exists
              ? progressDoc.data()?.storyPoints?.[data.storyPointId]
              : null;
            storyPointCompletedAt = existingSPProgress?.completedAt ?? now;
          }
        }
      }
    } catch (err) {
      logger.warn('Failed to check storyPoint completion', err);
    }

    // --- Space completion detection ---
    // Check if all storyPoints in the space are completed
    let spaceStatus: ProgressStatus = 'in_progress';
    let spaceCompletedAt: admin.firestore.FieldValue | undefined;
    if (storyPointStatus === 'completed') {
      try {
        const spaceDoc = await db
          .doc(`tenants/${data.tenantId}/spaces/${data.spaceId}`)
          .get();

        if (spaceDoc.exists) {
          const spaceData = spaceDoc.data();
          const totalStoryPoints = spaceData?.stats?.totalStoryPoints ?? 0;

          if (totalStoryPoints > 0) {
            // Build merged storyPoints map: existing progress + current storyPoint
            const existingStoryPoints = progressDoc.exists
              ? progressDoc.data()?.storyPoints ?? {}
              : {};

            let completedSPCount = 0;
            for (const [spId, spProgress] of Object.entries(existingStoryPoints) as [string, { status?: string }][]) {
              if (spId === data.storyPointId) {
                // Use the newly computed status for the current storyPoint
                if (storyPointStatus === 'completed') completedSPCount++;
              } else if (spProgress.status === 'completed') {
                completedSPCount++;
              }
            }
            // If the current storyPoint wasn't in existingStoryPoints yet, count it
            if (!existingStoryPoints[data.storyPointId] && storyPointStatus === 'completed') {
              completedSPCount++;
            }

            if (completedSPCount >= totalStoryPoints) {
              spaceStatus = 'completed';
              spaceCompletedAt = admin.firestore.FieldValue.serverTimestamp();
            }
          }
        }
      } catch (err) {
        logger.warn('Failed to check space completion', err);
      }
    }

    const progressUpdate: Record<string, unknown> = {
      id: progressId,
      userId: callerUid,
      tenantId: data.tenantId,
      spaceId: data.spaceId,
      status: spaceStatus,
      pointsEarned: totalPointsEarned,
      totalPoints: totalPointsAvailable,
      percentage: overallPercentage,
      storyPoints: {
        [data.storyPointId]: {
          storyPointId: data.storyPointId,
          status: storyPointStatus,
          pointsEarned: spPointsEarned,
          totalPoints: spPointsAvailable,
          percentage: spPercentage,
          ...(storyPointCompletedAt ? { completedAt: storyPointCompletedAt } : {}),
        },
      },
      items: mergedItems,
      startedAt: progressDoc.exists ? progressDoc.data()?.startedAt : admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (spaceCompletedAt) {
      progressUpdate.completedAt = spaceCompletedAt;
    }

    await progressRef.set(progressUpdate, { merge: true });

    // Update RTDB leaderboard
    try {
      const rtdb = admin.database();
      const userDoc = await db.doc(`users/${callerUid}`).get();
      const userData = userDoc.data();

      await rtdb.ref(`leaderboards/${data.tenantId}/${data.spaceId}/${callerUid}`).set({
        points: totalPointsEarned,
        displayName: userData?.displayName ?? 'Student',
        avatarUrl: userData?.photoUrl ?? null,
        completionPercent: Math.round(overallPercentage * 100),
        updatedAt: now,
      });
    } catch (err) {
      logger.warn('Failed to update RTDB leaderboard', err);
    }

    logger.info(
      `Recorded attempt for item ${data.itemId} by user ${callerUid}: ${data.score}/${data.maxScore}`,
    );

    return {
      success: true,
      bestScore,
      attemptsCount,
      totalPointsEarned,
      overallPercentage,
    };
  },
);
