import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { getFirebaseServices, callStartTestSession, callSubmitTestSession } from '@levelup/shared-services';
import type { DigitalTestSession } from '@levelup/shared-types';

export function useTestSessions(
  tenantId: string | null,
  userId: string | null,
  spaceId: string | null,
  storyPointId: string | null,
) {
  return useQuery<DigitalTestSession[]>({
    queryKey: ['tenants', tenantId, 'testSessions', userId, spaceId, storyPointId],
    queryFn: async () => {
      if (!tenantId || !userId || !spaceId || !storyPointId) return [];
      const { db } = getFirebaseServices();
      const colRef = collection(db, `tenants/${tenantId}/digitalTestSessions`);
      const q = query(
        colRef,
        where('userId', '==', userId),
        where('spaceId', '==', spaceId),
        where('storyPointId', '==', storyPointId),
        orderBy('createdAt', 'desc'),
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as DigitalTestSession);
    },
    enabled: !!tenantId && !!userId && !!spaceId && !!storyPointId,
    staleTime: 10 * 1000,
  });
}

export function useTestSession(tenantId: string | null, sessionId: string | null) {
  return useQuery<DigitalTestSession | null>({
    queryKey: ['tenants', tenantId, 'testSession', sessionId],
    queryFn: async () => {
      if (!tenantId || !sessionId) return null;
      const { db } = getFirebaseServices();
      const docRef = doc(db, `tenants/${tenantId}/digitalTestSessions`, sessionId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() } as DigitalTestSession;
    },
    enabled: !!tenantId && !!sessionId,
    staleTime: 5 * 1000,
    refetchInterval: 10 * 1000,
  });
}

export function useStartTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { tenantId: string; spaceId: string; storyPointId: string }) => {
      return callStartTestSession(params);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenants', variables.tenantId, 'testSessions'] });
    },
  });
}

export function useSubmitTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      tenantId: string;
      sessionId: string;
      submissions?: Record<string, unknown>;
      autoSubmitted?: boolean;
    }) => {
      return callSubmitTestSession(params);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenants', variables.tenantId, 'testSessions'] });
      queryClient.invalidateQueries({ queryKey: ['tenants', variables.tenantId, 'testSession'] });
    },
  });
}

/**
 * useSaveAnswer — saves a raw answer during a **timed test session** only.
 *
 * This is NOT for general item-attempt persistence (practice / story-point
 * viewers). For that, use `useRecordItemAttempt` from `@levelup/shared-hooks`,
 * which calls the `recordItemAttempt` callable with the scored-result contract:
 *   { tenantId, spaceId, storyPointId, itemId, itemType, score, maxScore, correct }
 *
 * This hook sends { tenantId, sessionId, itemId, answer, timeSpentSeconds }
 * to the `recordItemAttempt` callable using the timed-test session contract.
 * The server-side callable accepts both schemas: session-based (raw answer
 * save during a test) and scored-result (item-attempt persistence for
 * practice/story-point viewers). Final scoring for timed tests happens
 * server-side when `submitTestSession` is called.
 */
export function useSaveAnswer() {
  const { functions } = getFirebaseServices();
  const recordItemAttempt = httpsCallable<
    { tenantId: string; sessionId: string; itemId: string; answer: unknown; timeSpentSeconds: number },
    { success: boolean }
  >(functions, 'recordItemAttempt');

  return useMutation({
    mutationFn: async (params: {
      tenantId: string;
      sessionId: string;
      itemId: string;
      answer: unknown;
      timeSpentSeconds: number;
    }) => {
      const result = await recordItemAttempt(params);
      return result.data;
    },
  });
}
