"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitTestSession = void 0;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
const v2_1 = require("firebase-functions/v2");
const auth_1 = require("../utils/auth");
const firestore_1 = require("../utils/firestore");
const auto_evaluate_1 = require("../utils/auto-evaluate");
const shared_types_1 = require("@levelup/shared-types");
const utils_1 = require("../utils");
const rate_limit_1 = require("../utils/rate-limit");
const shared_types_2 = require("@levelup/shared-types");
const GRACE_PERIOD_MS = 30_000; // 30 seconds grace period
/**
 * Submit a timed test / quiz session.
 *
 * Validates timing, auto-evaluates deterministic questions,
 * triggers AI evaluation for subjective questions, computes scores
 * and detailed analytics (topic, difficulty, section, Bloom's breakdowns).
 */
exports.submitTestSession = (0, https_1.onCall)({ region: 'asia-south1', timeoutSeconds: 120, cors: true }, async (request) => {
    const callerUid = (0, auth_1.assertAuth)(request.auth);
    const data = (0, utils_1.parseRequest)(request.data, shared_types_1.SubmitTestSessionRequestSchema);
    if (!data.tenantId || !data.sessionId) {
        throw new https_1.HttpsError('invalid-argument', 'tenantId and sessionId are required');
    }
    await (0, auth_1.assertTenantMember)(callerUid, data.tenantId);
    await (0, rate_limit_1.enforceRateLimit)(data.tenantId, callerUid, 'write', 30);
    const db = (0, firestore_1.getDb)();
    const sessionRef = db.doc(`tenants/${data.tenantId}/digitalTestSessions/${data.sessionId}`);
    const sessionDoc = await sessionRef.get();
    if (!sessionDoc.exists) {
        throw new https_1.HttpsError('not-found', 'Test session not found');
    }
    const sessionResult = shared_types_2.DigitalTestSessionSchema.safeParse({ id: sessionDoc.id, ...sessionDoc.data() });
    if (!sessionResult.success) {
        v2_1.logger.error('Invalid DigitalTestSession document', { docId: sessionDoc.id, errors: sessionResult.error.flatten() });
        throw new https_1.HttpsError('internal', 'Data integrity error');
    }
    const session = sessionResult.data;
    // Verify ownership
    if (session.userId !== callerUid) {
        throw new https_1.HttpsError('permission-denied', 'Not your test session');
    }
    // Must be in_progress
    if (session.status !== 'in_progress') {
        throw new https_1.HttpsError('failed-precondition', `Session is already ${session.status}`);
    }
    // Validate timing for timed tests
    const now = admin.firestore.Timestamp.now();
    if (session.sessionType === 'timed_test' && session.serverDeadline) {
        const deadlineMs = session.serverDeadline.toMillis();
        if (now.toMillis() > deadlineMs + GRACE_PERIOD_MS) {
            throw new https_1.HttpsError('failed-precondition', 'Submission time exceeds the deadline plus grace period');
        }
    }
    // Load items with answer keys for grading
    const items = await (0, firestore_1.loadItems)(data.tenantId, session.spaceId, session.storyPointId);
    const itemMap = new Map(items.map((i) => [i.id, i]));
    // Load answer keys from server-only subcollection (parallelized)
    // Try nested path first (storyPoints subcollection), fallback to flat
    const answerKeyMap = new Map();
    const questionItems = items.filter((i) => i.type === 'question');
    const akResults = await Promise.all(questionItems.map(async (item) => {
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
    }));
    for (const { itemId, snap } of akResults) {
        if (!snap.empty) {
            answerKeyMap.set(itemId, snap.docs[0].data());
        }
    }
    // Grade each submission
    let totalPoints = 0;
    let pointsEarned = 0;
    let totalMarks = 0;
    let marksEarned = 0;
    const updatedSubmissions = {};
    for (const [itemId, submission] of Object.entries(session.submissions || {})) {
        const item = itemMap.get(itemId);
        if (!item)
            continue;
        const sub = submission;
        const itemPoints = item.meta?.totalPoints ?? item.payload?.basePoints ?? 1;
        const itemMarks = item.meta?.maxMarks ?? itemPoints;
        totalPoints += itemPoints;
        totalMarks += itemMarks;
        // Try auto-evaluation first
        const answerKey = answerKeyMap.get(itemId);
        const autoResult = (0, auto_evaluate_1.autoEvaluateSubmission)(item, sub, answerKey);
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
        }
        else {
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
            const itemPoints = item.meta?.totalPoints ?? item.payload?.basePoints ?? 1;
            const itemMarks = item.meta?.maxMarks ?? itemPoints;
            totalPoints += itemPoints;
            totalMarks += itemMarks;
        }
    }
    const percentage = totalPoints > 0 ? (pointsEarned / totalPoints) * 100 : 0;
    // Compute enhanced analytics
    const analytics = computeTestAnalytics(updatedSubmissions, itemMap, session.sectionMapping ?? {});
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
    await updateSpaceProgress(db, data.tenantId, callerUid, session.spaceId, session.storyPointId, pointsEarned, totalPoints, updatedSubmissions);
    v2_1.logger.info(`Submitted test session ${data.sessionId}: ${pointsEarned}/${totalPoints} (${percentage.toFixed(1)}%)`);
    return {
        success: true,
        pointsEarned,
        totalPoints,
        marksEarned: Math.round(marksEarned * 100) / 100,
        totalMarks,
        percentage: Math.round(percentage * 100) / 100,
    };
});
/**
 * Compute detailed test analytics from submissions.
 */
function computeTestAnalytics(submissions, itemMap, sectionMapping) {
    const topicBreakdown = {};
    const bloomsBreakdown = {};
    const difficultyBreakdown = {};
    const sectionBreakdown = {};
    const timePerQuestion = {};
    let totalTime = 0;
    let questionCount = 0;
    for (const [itemId, sub] of Object.entries(submissions)) {
        const item = itemMap.get(itemId);
        if (!item)
            continue;
        const payload = item.payload;
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
            if (isCorrect)
                topicBreakdown[topic].correct++;
            topicBreakdown[topic].points = (topicBreakdown[topic].points ?? 0) + pts;
            topicBreakdown[topic].maxPoints = (topicBreakdown[topic].maxPoints ?? 0) + maxPts;
        }
        // Difficulty breakdown
        const difficulty = payload.difficulty ?? item.difficulty ?? 'medium';
        if (!difficultyBreakdown[difficulty]) {
            difficultyBreakdown[difficulty] = { correct: 0, total: 0, points: 0, maxPoints: 0 };
        }
        difficultyBreakdown[difficulty].total++;
        if (isCorrect)
            difficultyBreakdown[difficulty].correct++;
        difficultyBreakdown[difficulty].points = (difficultyBreakdown[difficulty].points ?? 0) + pts;
        difficultyBreakdown[difficulty].maxPoints = (difficultyBreakdown[difficulty].maxPoints ?? 0) + maxPts;
        // Bloom's level breakdown
        const bloomsLevel = payload.bloomsLevel;
        if (bloomsLevel) {
            if (!bloomsBreakdown[bloomsLevel]) {
                bloomsBreakdown[bloomsLevel] = { correct: 0, total: 0, points: 0, maxPoints: 0 };
            }
            bloomsBreakdown[bloomsLevel].total++;
            if (isCorrect)
                bloomsBreakdown[bloomsLevel].correct++;
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
            if (isCorrect)
                sectionBreakdown[sectionId].correct++;
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
async function updateSpaceProgress(db, tenantId, userId, spaceId, storyPointId, pointsEarned, totalPoints, submissions) {
    const progressId = `${userId}_${spaceId}`;
    const progressRef = db.doc(`tenants/${tenantId}/spaceProgress/${progressId}`);
    const progressDoc = await progressRef.get();
    const now = Date.now();
    const itemEntries = {};
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
    let spaceStatus = 'in_progress';
    let spaceCompletedAt;
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
                for (const [spId, spProgress] of Object.entries(existingStoryPoints)) {
                    if (spId === storyPointId) {
                        // Current storyPoint is being completed now
                        completedSPCount++;
                    }
                    else if (spProgress.status === 'completed') {
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
    }
    catch (err) {
        v2_1.logger.warn('Failed to check space completion in updateSpaceProgress', err);
    }
    const progressUpdate = {
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
//# sourceMappingURL=submit-test-session.js.map