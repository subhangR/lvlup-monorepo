import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { assertAuth, assertTeacherOrAdmin } from '../utils/auth';
import { ImportFromBankRequestSchema } from '@levelup/shared-types';
import { parseRequest } from '../utils';
import { enforceRateLimit } from '../utils/rate-limit';
import { loadStoryPoint } from '../utils/firestore';
import type { QuestionBankItem } from '@levelup/shared-types';
import { QuestionBankItemSchema } from '@levelup/shared-types';

/**
 * Import questions from the question bank into a story point.
 * Creates UnifiedItem copies from QuestionBankItem sources.
 */
export const importFromBank = onCall(
  { region: 'asia-south1', cors: true },
  async (request) => {
    const callerUid = assertAuth(request.auth);
    const data = parseRequest(request.data, ImportFromBankRequestSchema);

    if (!data.tenantId || !data.spaceId || !data.storyPointId || !data.questionBankItemIds?.length) {
      throw new HttpsError('invalid-argument', 'tenantId, spaceId, storyPointId, and questionBankItemIds are required');
    }

    if (data.questionBankItemIds.length > 50) {
      throw new HttpsError('invalid-argument', 'Cannot import more than 50 questions at once');
    }

    await assertTeacherOrAdmin(callerUid, data.tenantId);
    await enforceRateLimit(data.tenantId, callerUid, 'write', 30);

    const db = admin.firestore();

    // Verify story point exists
    await loadStoryPoint(data.tenantId, data.spaceId, data.storyPointId);

    // Load bank items
    const bankItemRefs = data.questionBankItemIds.map((id) =>
      db.doc(`tenants/${data.tenantId}/questionBank/${id}`),
    );
    const bankItemDocs = await db.getAll(...bankItemRefs);

    // Get current max orderIndex in story point
    const existingItems = await db
      .collection(`tenants/${data.tenantId}/spaces/${data.spaceId}/items`)
      .where('storyPointId', '==', data.storyPointId)
      .orderBy('orderIndex', 'desc')
      .limit(1)
      .get();

    let orderIndex = existingItems.empty ? 0 : (existingItems.docs[0].data().orderIndex ?? 0) + 1;

    const batch = db.batch();
    const createdIds: string[] = [];

    for (const doc of bankItemDocs) {
      if (!doc.exists) continue;
      const bankItemResult = QuestionBankItemSchema.safeParse({ id: doc.id, ...doc.data() });
      if (!bankItemResult.success) {
        logger.error('Invalid QuestionBankItem document', { docId: doc.id, errors: bankItemResult.error.flatten() });
        continue; // Skip invalid bank items
      }
      const bankItem = bankItemResult.data as unknown as QuestionBankItem;

      const itemRef = db.collection(`tenants/${data.tenantId}/spaces/${data.spaceId}/items`).doc();

      batch.set(itemRef, {
        id: itemRef.id,
        spaceId: data.spaceId,
        storyPointId: data.storyPointId,
        sectionId: data.sectionId ?? null,
        tenantId: data.tenantId,
        type: 'question',
        payload: {
          questionType: bankItem.questionType,
          title: bankItem.title,
          content: bankItem.content,
          explanation: bankItem.explanation ?? null,
          basePoints: bankItem.basePoints ?? 1,
          difficulty: bankItem.difficulty,
          bloomsLevel: bankItem.bloomsLevel ?? null,
          questionData: bankItem.questionData,
        },
        title: bankItem.title,
        content: bankItem.content,
        difficulty: bankItem.difficulty,
        topics: bankItem.topics,
        labels: bankItem.tags,
        orderIndex,
        linkedQuestionId: null,
        createdBy: callerUid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Update usage count on bank item
      batch.update(doc.ref, {
        usageCount: admin.firestore.FieldValue.increment(1),
        lastUsedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      createdIds.push(itemRef.id);
      orderIndex++;
    }

    await batch.commit();

    logger.info(`Imported ${createdIds.length} questions from bank into story point ${data.storyPointId}`);

    return {
      success: true,
      importedCount: createdIds.length,
      itemIds: createdIds,
    };
  },
);
