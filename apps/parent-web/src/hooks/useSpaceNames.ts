import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where, documentId } from "firebase/firestore";
import { getFirebaseServices } from "@levelup/shared-services";
import type { Space } from "@levelup/shared-types";

export function useSpaceNames(tenantId: string | null, spaceIds: string[]) {
  return useQuery<Record<string, string>>({
    queryKey: ["tenants", tenantId, "spaceNames", spaceIds],
    queryFn: async () => {
      if (!tenantId || !spaceIds.length) return {};
      const { db } = getFirebaseServices();
      const names: Record<string, string> = {};
      for (let i = 0; i < spaceIds.length; i += 30) {
        const batch = spaceIds.slice(i, i + 30);
        try {
          const colRef = collection(db, `tenants/${tenantId}/spaces`);
          const q = query(colRef, where(documentId(), "in", batch));
          const snap = await getDocs(q);
          for (const d of snap.docs) {
            names[d.id] = (d.data() as Space).title;
          }
        } catch {
          // Ignore batch errors
        }
      }
      return names;
    },
    enabled: !!tenantId && spaceIds.length > 0,
    staleTime: 10 * 60 * 1000,
  });
}
