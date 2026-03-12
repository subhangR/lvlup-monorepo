import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { getFirebaseServices } from '@levelup/shared-services';
import type { UnifiedItem } from '@levelup/shared-types';

export function useStoryPointItems(
  tenantId: string | null,
  spaceId: string | null,
  storyPointId: string | null,
) {
  return useQuery<UnifiedItem[]>({
    queryKey: ['tenants', tenantId, 'spaces', spaceId, 'storyPoints', storyPointId, 'items'],
    queryFn: async () => {
      if (!tenantId || !spaceId || !storyPointId) return [];
      const { db } = getFirebaseServices();
      const colRef = collection(
        db,
        `tenants/${tenantId}/spaces/${spaceId}/storyPoints/${storyPointId}/items`,
      );
      const q = query(colRef, orderBy('orderIndex', 'asc'));
      try {
        const snap = await getDocs(q);
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as UnifiedItem);
      } catch (err) {
        throw new Error(
          `Failed to load items for story point ${storyPointId}: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    },
    enabled: !!tenantId && !!spaceId && !!storyPointId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSectionItems(
  tenantId: string | null,
  spaceId: string | null,
  storyPointId: string | null,
  sectionId: string | null,
) {
  return useQuery<UnifiedItem[]>({
    queryKey: ['tenants', tenantId, 'spaces', spaceId, 'storyPoints', storyPointId, 'sections', sectionId, 'items'],
    queryFn: async () => {
      if (!tenantId || !spaceId || !storyPointId || !sectionId) return [];
      const { db } = getFirebaseServices();
      const colRef = collection(
        db,
        `tenants/${tenantId}/spaces/${spaceId}/storyPoints/${storyPointId}/items`,
      );
      const q = query(
        colRef,
        where('sectionId', '==', sectionId),
        orderBy('orderIndex', 'asc'),
      );
      try {
        const snap = await getDocs(q);
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as UnifiedItem);
      } catch (err) {
        throw new Error(
          `Failed to load section items for ${sectionId}: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    },
    enabled: !!tenantId && !!spaceId && !!storyPointId && !!sectionId,
    staleTime: 5 * 60 * 1000,
  });
}
