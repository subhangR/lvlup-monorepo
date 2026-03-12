import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getFirebaseServices } from "@levelup/shared-services";
import type { SpaceProgress } from "@levelup/shared-types";

export function useChildProgress(
  tenantId: string | null,
  studentIds: string[] | undefined,
) {
  return useQuery<SpaceProgress[]>({
    queryKey: ["tenants", tenantId, "childProgress", studentIds],
    queryFn: async () => {
      if (!tenantId || !studentIds?.length) return [];
      const { db } = getFirebaseServices();
      const allProgress: SpaceProgress[] = [];
      for (let i = 0; i < studentIds.length; i += 30) {
        const batch = studentIds.slice(i, i + 30);
        const colRef = collection(db, `tenants/${tenantId}/spaceProgress`);
        const q = query(colRef, where("userId", "in", batch));
        const snap = await getDocs(q);
        allProgress.push(
          ...snap.docs.map(
            (d) => ({ id: d.id, ...d.data() }) as SpaceProgress,
          ),
        );
      }
      return allProgress;
    },
    enabled: !!tenantId && !!studentIds?.length,
    staleTime: 60 * 1000,
  });
}
