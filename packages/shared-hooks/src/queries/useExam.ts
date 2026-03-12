import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseServices } from '@levelup/shared-services';
import type { Exam } from '@levelup/shared-types';

export function useExam(tenantId: string | null, examId: string | null) {
  return useQuery<Exam | null>({
    queryKey: ['tenants', tenantId, 'exams', examId],
    queryFn: async () => {
      if (!tenantId || !examId) return null;
      const { db } = getFirebaseServices();
      const docRef = doc(db, `tenants/${tenantId}/exams`, examId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() } as Exam;
    },
    enabled: !!tenantId && !!examId,
    staleTime: 30 * 1000,
  });
}
