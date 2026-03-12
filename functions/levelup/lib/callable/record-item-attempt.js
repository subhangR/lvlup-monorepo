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
exports.recordItemAttempt = void 0;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
const v2_1 = require("firebase-functions/v2");
const auth_1 = require("../utils/auth");
const shared_types_1 = require("@levelup/shared-types");
const utils_1 = require("../utils");
const rate_limit_1 = require("../utils/rate-limit");
/**
 * Record an item attempt for non-test items (standard storyPoints, practice, etc.).
 * Updates SpaceProgress with best score tracking.
 */
exports.recordItemAttempt = (0, https_1.onCall)({ region: 'asia-south1', cors: true }, async (request) => {
    const callerUid = (0, auth_1.assertAuth)(request.auth);
    const data = (0, utils_1.parseRequest)(request.data, shared_types_1.RecordItemAttemptRequestSchema);
    if (!data.tenantId || !data.spaceId || !data.storyPointId || !data.itemId) {
        throw new https_1.HttpsError('invalid-argument', 'tenantId, spaceId, storyPointId, and itemId are required');
    }
    await (0, auth_1.assertTenantMember)(callerUid, data.tenantId);
    await (0, rate_limit_1.enforceRateLimit)(data.tenantId, callerUid, 'write', 30);
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
    for (const entry of Object.values(mergedItems)) {
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
    for (const entry of Object.values(mergedItems)) {
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
    let storyPointStatus = 'in_progress';
    let storyPointCompletedAt;
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
                for (const entry of Object.values(mergedItems)) {
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
    }
    catch (err) {
        v2_1.logger.warn('Failed to check storyPoint completion', err);
    }
    // --- Space completion detection ---
    // Check if all storyPoints in the space are completed
    let spaceStatus = 'in_progress';
    let spaceCompletedAt;
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
                    for (const [spId, spProgress] of Object.entries(existingStoryPoints)) {
                        if (spId === data.storyPointId) {
                            // Use the newly computed status for the current storyPoint
                            if (storyPointStatus === 'completed')
                                completedSPCount++;
                        }
                        else if (spProgress.status === 'completed') {
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
        }
        catch (err) {
            v2_1.logger.warn('Failed to check space completion', err);
        }
    }
    const progressUpdate = {
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
    }
    catch (err) {
        v2_1.logger.warn('Failed to update RTDB leaderboard', err);
    }
    v2_1.logger.info(`Recorded attempt for item ${data.itemId} by user ${callerUid}: ${data.score}/${data.maxScore}`);
    return {
        success: true,
        bestScore,
        attemptsCount,
        totalPointsEarned,
        overallPercentage,
    };
});
//# sourceMappingURL=record-item-attempt.js.map