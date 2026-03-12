import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy, QueryConstraint } from 'firebase/firestore';
import { getFirebaseServices } from '@levelup/shared-services';
import type { Submission } from '@levelup/shared-types';

export type { Submission } from '@levelup/shared-types';

export function useSubmissions(
  tenantId: string | null,
  options?: { examId?: string; studentId?: string; status?: string },
) {
  return useQuery<Submission[]>({
    queryKey: ['tenants', tenantId, 'submissions', options ?? {}],
    queryFn: async () => {
      if (!tenantId) return [];
      const { db } = getFirebaseServices();
      const colRef = collection(db, `tenants/${tenantId}/submissions`);
      const constraints: QueryConstraint[] = [];
      if (options?.examId) {
        constraints.push(where('examId', '==', options.examId));
      }
      if (options?.studentId) {
        constraints.push(where('studentId', '==', options.studentId));
      }
      if (options?.status) {
        constraints.push(where('status', '==', options.status));
      }
      constraints.push(orderBy('createdAt', 'desc'));
      const q = query(colRef, ...constraints);
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Submission);
    },
    enabled: !!tenantId,
    staleTime: 30 * 1000,
  });
}
