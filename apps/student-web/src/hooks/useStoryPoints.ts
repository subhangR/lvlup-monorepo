import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { getFirebaseServices } from '@levelup/shared-services';
import type { StoryPoint } from '@levelup/shared-types';

export function useStoryPoints(tenantId: string | null, spaceId: string | null) {
  return useQuery<StoryPoint[]>({
    queryKey: ['tenants', tenantId, 'spaces', spaceId, 'storyPoints'],
    queryFn: async () => {
      if (!tenantId || !spaceId) return [];
      const { db } = getFirebaseServices();
      const colRef = collection(db, `tenants/${tenantId}/spaces/${spaceId}/storyPoints`);
      const q = query(colRef, orderBy('orderIndex', 'asc'));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as StoryPoint);
    },
    enabled: !!tenantId && !!spaceId,
    staleTime: 5 * 60 * 1000,
  });
}
