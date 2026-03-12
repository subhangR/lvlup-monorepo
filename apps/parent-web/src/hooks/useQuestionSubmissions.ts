import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { getFirebaseServices } from "@levelup/shared-services";
import type { QuestionSubmission } from "@levelup/shared-types";

export function useQuestionSubmissions(
  tenantId: string | null,
  submissionId: string | null,
) {
  return useQuery<QuestionSubmission[]>({
    queryKey: ["tenants", tenantId, "questionSubmissions", submissionId],
    queryFn: async () => {
      if (!tenantId || !submissionId) return [];
      const { db } = getFirebaseServices();
      const colRef = collection(
        db,
        `tenants/${tenantId}/submissions/${submissionId}/questionSubmissions`,
      );
      const snap = await getDocs(colRef);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as QuestionSubmission);
    },
    enabled: !!tenantId && !!submissionId,
    staleTime: 5 * 60 * 1000,
  });
}
