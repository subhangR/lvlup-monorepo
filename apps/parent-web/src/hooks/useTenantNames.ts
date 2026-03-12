import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseServices } from "@levelup/shared-services";
import type { Tenant } from "@levelup/shared-types";

export function useTenantNames(tenantIds: string[]) {
  return useQuery<Record<string, string>>({
    queryKey: ["tenantNames", tenantIds],
    queryFn: async () => {
      if (!tenantIds.length) return {};
      const { db } = getFirebaseServices();
      const names: Record<string, string> = {};
      await Promise.all(
        tenantIds.map(async (id) => {
          try {
            const snap = await getDoc(doc(db, "tenants", id));
            if (snap.exists()) {
              names[id] = (snap.data() as Tenant).name;
            }
          } catch {
            // Fallback handled below
          }
        }),
      );
      return names;
    },
    enabled: tenantIds.length > 0,
    staleTime: 10 * 60 * 1000,
  });
}
