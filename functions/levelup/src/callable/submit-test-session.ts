import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { assertAuth, assertTenantMember } from '../utils/auth';
import { getDb, loadItems } from '../utils/firestore';
import { autoEvaluateSubmission } from '../utils/auto-evaluate';
import { SubmitTestSessionRequestSchema } from '@levelup/shared-types';
import { parseRequest } from '../utils';
import { enforceRateLimit } from '../utils/rate-limit';
import type { DigitalTestSession, TestSubmission, AnswerKey, QuestionPayload } from '../types';
import type { TestAnalytics, AnalyticsBreakdownEntry, UnifiedItem } from '@levelup/shared-types';
import { DigitalTestSessionSchema } from '@levelup/shared-types';

const GRACE_PERIOD_MS = 30_000; // 30 seconds grace period

/**
 * Submit a timed test / quiz session.
 *
 * Validates timing, auto-evaluates deterministic questions,
 * triggers AI evaluation for subjective questions, computes scores
 * and detailed analytics (topic, difficulty, section, Bloom's breakdowns).
 */
export const submitTestSession = onCall(
  { region: 'asia-south1', timeoutSeconds: 120, cors: true },
  async (request) => {
    const callerUid = assertAuth(request.auth);
    const data = parseRequest(request.data, SubmitTestSessionRequestSchema);

    if (!data.tenantId || !data.sessionId) {
      throw new HttpsError('invalid-argument', 'tenantId and sessionId are required');
    }

    await assertTenantMember(callerUid, data.tenantId);
    await enforceRateLimit(data.tenantId, callerUid, 'write', 30);

    const db = getDb();
    const sessionRef = db.doc(`tenants/${data.tenantId}/digitalTestSessions/${data.sessionId}`);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      throw new HttpsError('not-found', 'Test session not found');
    }

    const sessionResult = DigitalTestSessionSchema.safeParse({ id: sessionDoc.id, ...sessionDoc.data() });
    if (!sessionResult.success) {
      logger.error('Invalid DigitalTestSession document', { docId: sessionDoc.id, errors: sessionResult.error.flatten() });
      throw new HttpsError('internal', 'Data integrity error');
    }
    const session = sessionResult.data as unknown as DigitalTestSession;

    // Verify ownership
    if (session.userId !== callerUid) {
      throw new HttpsError('permission-denied', 'Not your test session');
    }

    // Must be in_progress
    if (session.status !== 'in_progress') {
      throw new HttpsError('failed-precondition', `Session is already ${session.status}`);
    }

    // Validate timing for timed tests
    const now = admin.firestore.Timestamp.now();
    if (session.sessionType === 'timed_test' && session.serverDeadline) {
      const deadlineMs = session.serverDeadline.toMillis();
      if (now.toMillis() > deadlineMs + GRACE_PERIOD_MS) {
        throw new HttpsError(
          'failed-precondition',
          'Submission time exceeds the deadline plus grace period',
        );
      }
    }

    // Load items with answer keys for grading
    const items = await loadItems(data.tenantId, session.spaceId, session.storyPointId);
    const itemMap = new Map(items.map((i: UnifiedItem) => [i.id, i]));

    // Load answer keys from server-only subcollection (parallelized)
    // Try nested path first (storyPoints subcollection), fallback to flat
    const answerKeyMap = new Map<string, AnswerKey>();
    const questionItems = items.filter((i: UnifiedItem) => i.type === 'question');
    const akResults = await Promise.all(
      questionItems.map(async (item: UnifiedItem) => {
        // Try nested path first
        let snap = await db
          .collection(`tenants/${data.tenantId}/spaces/${session.spaceId}/storyPoints/${session.storyPointId}/items/${item.id}/answerKeys`)
          .limit(1)
          .get();
        // Fallback to flat path
        if (snap.empty) {
          snap = await db
            .collection(`tenants/${data.tenantId}/spaces/${session.spaceId}/items/${item.id}/answerKeys`)
            .limit(1)
            .get();
        }
        return { itemId: item.id, snap };
      }),
    );
    for (const { itemId, snap } of akResults) {
      if (!snap.empty) {
        answerKeyMap.set(itemId, snap.docs[0].data() as AnswerKey);
      }
    }

    // Grade each submission
    let totalPoints = 0;
    let pointsEarned = 0;
    let totalMarks = 0;
    let marksEarned = 0;
    const updatedSubmissions: Record<string, TestSubmission> = {};

    for (const [itemId, submission] of Object.entries(session.submissions || {})) {
      const item = itemMap.get(itemId);
      if (!item) continue;

      const sub = submission as TestSubmission;
      const itemPoints = item.meta?.totalPoints ?? (item.payload as QuestionPayload)?.basePoints ?? 1;
      const itemMarks = item.meta?.maxMarks ?? itemPoints;
      totalPoints += itemPoints;
      totalMarks += itemMarks;

      // Try auto-evaluation first
      const answerKey = answerKeyMap.get(itemId);
      const autoResult = autoEvaluateSubmission(item, sub, answerKey);

      if (autoResult) {
        updatedSubmissions[itemId] = {
          ...sub,
          evaluation: autoResult,
          correct: autoResult.correctness >= 1,
          pointsEarned: autoResult.score,
          totalPoints: itemPoints,
        };
        pointsEarned += autoResult.score;
        marksEarned += (autoResult.correctness * itemMarks);
      } else {
        // AI evaluation needed — mark as pending
        updatedSubmissions[itemId] = {
          ...sub,
          pointsEarned: 0,
          totalPoints: itemPoints,
        };
      }
    }

    // Also count unanswered questions in total
    for (const item of items) {
      if (item.type === 'question' && !session.submissions?.[item.id]) {
        const itemPoints = item.meta?.totalPoints ?? (item.payload as QuestionPayload)?.basePoints ?? 1;
        const itemMarks = item.meta?.maxMarks ?? itemPoints;
        totalPoints += itemPoints;
        totalMarks += itemMarks;
      }
    }

    const percentage = totalPoints > 0 ? (pointsEarned / totalPoints) * 100 : 0;

    // Compute enhanced analytics
    const analytics = computeTestAnalytics(
      updatedSubmissions,
      itemMap,
      session.sectionMapping ?? {},
    );

    // Update session
    await sessionRef.update({
      status: 'completed',
      submissions: updatedSubmissions,
      pointsEarned,
      totalPoints,
      marksEarned: Math.round(marksEarned * 100) / 100,
      totalMarks,
      percentage: Math.round(percentage * 100) / 100,
      analytics,
      submittedAt: now,
      endedAt: now,
      autoSubmitted: data.autoSubmitted ?? false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update space progress
    await updateSpaceProgress(
      db,
      data.tenantId,
      callerUid,
      session.spaceId,
      session.storyPointId,
      pointsEarned,
      totalPoints,
      updatedSubmissions,
    );

    logger.info(
      `Submitted test session ${data.sessionId}: ${pointsEarned}/${totalPoints} (${percentage.toFixed(1)}%)`,
    );

    return {
      success: true,
      pointsEarned,
      totalPoints,
      marksEarned: Math.round(marksEarned * 100) / 100,
      totalMarks,
      percentage: Math.round(percentage * 100) / 100,
    };
  },
);

/**
 * Compute detailed test analytics from submissions.
 */
function computeTestAnalytics(
  submissions: Record<string, TestSubmission>,
  itemMap: Map<string, UnifiedItem>,
  sectionMapping: Record<string, string>,
): TestAnalytics {
  const topicBreakdown: Record<string, AnalyticsBreakdownEntry> = {};
  const bloomsBreakdown: Record<string, AnalyticsBreakdownEntry> = {};
  const difficultyBreakdown: Record<string, AnalyticsBreakdownEntry> = {};
  const sectionBreakdown: Record<string, AnalyticsBreakdownEntry> = {};
  const timePerQuestion: Record<string, number> = {};
  let totalTime = 0;
  let questionCount = 0;

  for (const [itemId, sub] of Object.entries(submissions)) {
    const item = itemMap.get(itemId);
    if (!item) continue;

    const payload = item.payload as QuestionPayload;
    const isCorrect = sub.correct ?? false;
    const pts = sub.pointsEarned ?? 0;
    const maxPts = sub.totalPoints ?? 0;

    // Time tracking
    if (sub.timeSpentSeconds > 0) {
      timePerQuestion[itemId] = sub.timeSpentSeconds;
      totalTime += sub.timeSpentSeconds;
      questionCount++;
    }

    // Topic breakdown
    const topics = item.topics ?? [];
    for (const topic of topics) {
      if (!topicBreakdown[topic]) {
        topicBreakdown[topic] = { correct: 0, total: 0, points: 0, maxPoints: 0 };
      }
      topicBreakdown[topic].total++;
      if (isCorrect) topicBreakdown[topic].correct++;
      topicBreakdown[topic].points = (topicBreakdown[topic].points ?? 0) + pts;
      topicBreakdown[topic].maxPoints = (topicBreakdown[topic].maxPoints ?? 0) + maxPts;
    }

    // Difficulty breakdown
    const difficulty = payload.difficulty ?? item.difficulty ?? 'medium';
    if (!difficultyBreakdown[difficulty]) {
      difficultyBreakdown[difficulty] = { correct: 0, total: 0, points: 0, maxPoints: 0 };
    }
    difficultyBreakdown[difficulty].total++;
    if (isCorrect) difficultyBreakdown[difficulty].correct++;
    difficultyBreakdown[difficulty].points = (difficultyBreakdown[difficulty].points ?? 0) + pts;
    difficultyBreakdown[difficulty].maxPoints = (difficultyBreakdown[difficulty].maxPoints ?? 0) + maxPts;

    // Bloom's level breakdown
    const bloomsLevel = payload.bloomsLevel;
    if (bloomsLevel) {
      if (!bloomsBreakdown[bloomsLevel]) {
        bloomsBreakdown[bloomsLevel] = { correct: 0, total: 0, points: 0, maxPoints: 0 };
      }
      bloomsBreakdown[bloomsLevel].total++;
      if (isCorrect) bloomsBreakdown[bloomsLevel].correct++;
      bloomsBreakdown[bloomsLevel].points = (bloomsBreakdown[bloomsLevel].points ?? 0) + pts;
      bloomsBreakdown[bloomsLevel].maxPoints = (bloomsBreakdown[bloomsLevel].maxPoints ?? 0) + maxPts;
    }

    // Section breakdown
    const sectionId = sectionMapping[itemId];
    if (sectionId) {
      if (!sectionBreakdown[sectionId]) {
        sectionBreakdown[sectionId] = { correct: 0, total: 0, points: 0, maxPoints: 0 };
      }
      sectionBreakdown[sectionId].total++;
      if (isCorrect) sectionBreakdown[sectionId].correct++;
      sectionBreakdown[sectionId].points = (sectionBreakdown[sectionId].points ?? 0) + pts;
      sectionBreakdown[sectionId].maxPoints = (sectionBreakdown[sectionId].maxPoints ?? 0) + maxPts;
    }
  }

  return {
    topicBreakdown: Object.keys(topicBreakdown).length > 0 ? topicBreakdown : undefined,
    bloomsBreakdown: Object.keys(bloomsBreakdown).length > 0 ? bloomsBreakdown : undefined,
    difficultyBreakdown: Object.keys(difficultyBreakdown).length > 0 ? difficultyBreakdown : undefined,
    sectionBreakdown: Object.keys(sectionBreakdown).length > 0 ? sectionBreakdown : undefined,
    timePerQuestion: Object.keys(timePerQuestion).length > 0 ? timePerQuestion : undefined,
    averageTimePerQuestion: questionCount > 0 ? Math.round(totalTime / questionCount) : undefined,
  };
}

async function updateSpaceProgress(
  db: admin.firestore.Firestore,
  tenantId: string,
  userId: string,
  spaceId: string,
  storyPointId: string,
  pointsEarned: number,
  totalPoints: number,
  submissions: Record<string, TestSubmission>,
): Promise<void> {
  const progressId = `${userId}_${spaceId}`;
  const progressRef = db.doc(`tenants/${tenantId}/spaceProgress/${progressId}`);
  const progressDoc = await progressRef.get();

  const now = Date.now();
  const itemEntries: Record<string, unknown> = {};

  for (const [itemId, sub] of Object.entries(submissions)) {
    const existing = progressDoc.exists ? progressDoc.data()?.items?.[itemId] : null;
    const bestScore = Math.max(sub.pointsEarned ?? 0, existing?.questionData?.bestScore ?? 0);

    itemEntries[itemId] = {
      itemId,
      itemType: 'question',
      completed: (sub.correct ?? false) || bestScore > 0,
      lastUpdatedAt: now,
      questionData: {
        status: sub.correct ? 'correct' : sub.pointsEarned ? 'partial' : 'incorrect',
        attemptsCount: (existing?.questionData?.attemptsCount ?? 0) + 1,
        bestScore,
        pointsEarned: bestScore,
        totalPoints: sub.totalPoints ?? 0,
        percentage: sub.totalPoints ? (bestScore / sub.totalPoints) * 100 : 0,
        solved: sub.correct ?? false,
      },
    };
  }

  const percentage = totalPoints > 0 ? pointsEarned / totalPoints : 0;

  // --- Space completion detection ---
  // The storyPoint is already completed (test submitted). Check if all storyPoints in the space are now done.
  let spaceStatus: 'in_progress' | 'completed' = 'in_progress';
  let spaceCompletedAt: admin.firestore.FieldValue | undefined;

  try {
    const spaceDoc = await db.doc(`tenants/${tenantId}/spaces/${spaceId}`).get();

    if (spaceDoc.exists) {
      const spaceData = spaceDoc.data();
      const totalStoryPoints = spaceData?.stats?.totalStoryPoints ?? 0;

      if (totalStoryPoints > 0) {
        // Build merged storyPoints map: existing progress + current storyPoint (now completed)
        const existingStoryPoints = progressDoc.exists
          ? progressDoc.data()?.storyPoints ?? {}
          : {};

        let completedSPCount = 0;
        for (const [spId, spProgress] of Object.entries(existingStoryPoints) as [string, { status?: string }][]) {
          if (spId === storyPointId) {
            // Current storyPoint is being completed now
            completedSPCount++;
          } else if (spProgress.status === 'completed') {
            completedSPCount++;
          }
        }
        // If the current storyPoint wasn't in existingStoryPoints yet, count it
        if (!existingStoryPoints[storyPointId]) {
          completedSPCount++;
        }

        if (completedSPCount >= totalStoryPoints) {
          spaceStatus = 'completed';
          spaceCompletedAt = admin.firestore.FieldValue.serverTimestamp();
        }
      }
    }
  } catch (err) {
    logger.warn('Failed to check space completion in updateSpaceProgress', err);
  }

  const progressUpdate: Record<string, unknown> = {
    id: progressId,
    userId,
    tenantId,
    spaceId,
    status: spaceStatus,
    pointsEarned,
    totalPoints,
    percentage,
    storyPoints: {
      [storyPointId]: {
        storyPointId,
        status: 'completed',
        pointsEarned,
        totalPoints,
        percentage,
        completedAt: now,
      },
    },
    items: itemEntries,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (spaceCompletedAt) {
    progressUpdate.completedAt = spaceCompletedAt;
  }

  await progressRef.set(progressUpdate, { merge: true });
}
