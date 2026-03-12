import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy, QueryConstraint } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { getFirebaseServices } from '@levelup/shared-services';
import type { Student } from '@levelup/shared-types';

export type { Student } from '@levelup/shared-types';

export function useStudents(
  tenantId: string | null,
  options?: { classId?: string; status?: string; grade?: string },
) {
  return useQuery<Student[]>({
    queryKey: ['tenants', tenantId, 'students', options ?? {}],
    queryFn: async () => {
      if (!tenantId) return [];
      const { db } = getFirebaseServices();
      const colRef = collection(db, `tenants/${tenantId}/students`);
      const constraints: QueryConstraint[] = [];
      if (options?.classId) {
        constraints.push(where('classIds', 'array-contains', options.classId));
      }
      if (options?.status) {
        constraints.push(where('status', '==', options.status));
      }
      if (options?.grade) {
        constraints.push(where('grade', '==', options.grade));
      }
      constraints.push(orderBy('rollNumber', 'asc'));
      const q = query(colRef, ...constraints);
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Student);
    },
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  const { functions } = getFirebaseServices();
  const callable = httpsCallable<
    { tenantId: string; uid: string; rollNumber?: string; section?: string; classId?: string; grade?: string; admissionNumber?: string; dateOfBirth?: string },
    { studentId: string }
  >(functions, 'createStudent');

  return useMutation({
    mutationFn: async (params: {
      tenantId: string;
      uid: string;
      rollNumber?: string;
      section?: string;
      classId?: string;
      grade?: string;
      admissionNumber?: string;
      dateOfBirth?: string;
    }) => {
      const result = await callable(params);
      return result.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenants', variables.tenantId, 'students'] });
      queryClient.invalidateQueries({ queryKey: ['tenants', variables.tenantId, 'classes'] });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  const { functions } = getFirebaseServices();
  const callable = httpsCallable<
    { tenantId: string; studentId: string; rollNumber?: string; section?: string; classIds?: string[]; parentIds?: string[]; grade?: string; admissionNumber?: string; dateOfBirth?: string },
    { success: boolean }
  >(functions, 'updateStudent');

  return useMutation({
    mutationFn: async (params: {
      tenantId: string;
      studentId: string;
      rollNumber?: string;
      section?: string;
      classIds?: string[];
      parentIds?: string[];
      grade?: string;
      admissionNumber?: string;
      dateOfBirth?: string;
    }) => {
      const result = await callable(params);
      return result.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenants', variables.tenantId, 'students'] });
      queryClient.invalidateQueries({ queryKey: ['tenants', variables.tenantId, 'classes'] });
    },
  });
}
