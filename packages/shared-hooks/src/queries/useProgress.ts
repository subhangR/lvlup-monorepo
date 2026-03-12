import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getFirebaseServices } from '@levelup/shared-services';
import type { SpaceProgress } from '@levelup/shared-types';

export type StudentProgress = SpaceProgress;

export function useProgress(
  tenantId: string | null,
  studentId: string | null,
  spaceId?: string,
) {
  return useQuery<SpaceProgress | null>({
    queryKey: ['tenants', tenantId, 'progress', studentId, spaceId ?? 'overall'],
    queryFn: async () => {
      if (!tenantId || !studentId) return null;
      const { db } = getFirebaseServices();

      if (spaceId) {
        // Get progress for a specific space
        const colRef = collection(db, `tenants/${tenantId}/spaceProgress`);
        const q = query(
          colRef,
          where('userId', '==', studentId),
          where('spaceId', '==', spaceId),
        );
        const snap = await getDocs(q);
        if (snap.empty) return null;
        const d = snap.docs[0]!;
        return { id: d.id, ...d.data() } as SpaceProgress;
      }

      // Overall mode: fetch ALL spaceProgress docs for this user and
      // aggregate them into a single summary. Doc IDs are {userId}_{spaceId},
      // so we cannot fetch by studentId alone as a doc ID.
      const colRef = collection(db, `tenants/${tenantId}/spaceProgress`);
      const q = query(colRef, where('userId', '==', studentId));
      const snap = await getDocs(q);
      if (snap.empty) return null;

      // Aggregate across all spaces
      let totalPointsEarned = 0;
      let totalPointsMax = 0;
      const allStoryPoints: Record<string, any> = {};
      const allItems: Record<string, any> = {};

      for (const d of snap.docs) {
        const data = d.data() as SpaceProgress;
        totalPointsEarned += data.pointsEarned ?? 0;
        totalPointsMax += data.totalPoints ?? 0;
        Object.assign(allStoryPoints, data.storyPoints ?? {});
        Object.assign(allItems, data.items ?? {});
      }

      const firstDoc = snap.docs[0]!;
      return {
        ...firstDoc.data(),
        id: `${studentId}_overall`,
        pointsEarned: totalPointsEarned,
        totalPoints: totalPointsMax,
        percentage: totalPointsMax > 0 ? (totalPointsEarned / totalPointsMax) * 100 : 0,
        storyPoints: allStoryPoints,
        items: allItems,
      } as SpaceProgress;
    },
    enabled: !!tenantId && !!studentId,
    staleTime: 30 * 1000,
  });
}
