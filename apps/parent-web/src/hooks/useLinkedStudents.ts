import { useQuery } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getFirebaseServices } from "@levelup/shared-services";
import type { UserMembership } from "@levelup/shared-types";

export function useLinkedStudents(
  tenantId: string | null,
  parentId: string | null,
) {
  return useQuery<UserMembership[]>({
    queryKey: ["tenants", tenantId, "linkedStudents", parentId],
    queryFn: async () => {
      if (!tenantId || !parentId) return [];
      const { db } = getFirebaseServices();
      const colRef = collection(db, "userMemberships");
      const q = query(
        colRef,
        where("tenantId", "==", tenantId),
        where("parentId", "==", parentId),
        where("role", "==", "student"),
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as UserMembership);
    },
    enabled: !!tenantId && !!parentId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLinkedStudentIds(
  tenantId: string | null,
  parentId: string | null,
) {
  const { data, ...rest } = useLinkedStudents(tenantId, parentId);
  return {
    ...rest,
    data: data?.map((s) => s.uid),
  };
}
