import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseServices } from "@levelup/shared-services";
import type { UnifiedUser } from "@levelup/shared-types";

export function useStudentNames(tenantId: string | null, studentIds: string[]) {
  return useQuery<Record<string, string>>({
    queryKey: ["tenants", tenantId, "studentNames", studentIds],
    queryFn: async () => {
      if (!studentIds.length) return {};
      const { db } = getFirebaseServices();
      const names: Record<string, string> = {};
      await Promise.all(
        studentIds.map(async (uid) => {
          try {
            const snap = await getDoc(doc(db, "users", uid));
            if (snap.exists()) {
              const u = snap.data() as UnifiedUser;
              names[uid] = u.displayName || u.email || uid.slice(0, 8);
            }
          } catch {
            // fallback handled by caller
          }
        }),
      );
      return names;
    },
    enabled: studentIds.length > 0,
    staleTime: 10 * 60 * 1000,
  });
}
