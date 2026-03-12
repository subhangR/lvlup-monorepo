import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { getFirebaseServices, callSendChatMessage } from '@levelup/shared-services';
import type { ChatSession } from '@levelup/shared-types';

/** Fetch the most recent active chat session for an item */
export function useChatSession(
  tenantId: string | null,
  userId: string | null,
  itemId: string | null,
  sessionId?: string | null,
) {
  return useQuery<ChatSession | null>({
    queryKey: ['tenants', tenantId, 'chatSessions', userId, itemId, sessionId ?? 'latest'],
    queryFn: async () => {
      if (!tenantId || !userId || !itemId) return null;
      const { db } = getFirebaseServices();
      const colRef = collection(db, `tenants/${tenantId}/chatSessions`);

      // If a specific session ID is provided, fetch it directly
      if (sessionId) {
        const { doc, getDoc } = await import('firebase/firestore');
        const snap = await getDoc(doc(db, `tenants/${tenantId}/chatSessions`, sessionId));
        if (!snap.exists()) return null;
        return { id: snap.id, ...snap.data() } as ChatSession;
      }

      // Otherwise fetch the most recent active session for this item
      const q = query(
        colRef,
        where('userId', '==', userId),
        where('itemId', '==', itemId),
        where('isActive', '==', true),
        orderBy('updatedAt', 'desc'),
        limit(1),
      );
      const snap = await getDocs(q);
      if (snap.empty) return null;
      const d = snap.docs[0]!;
      return { id: d.id, ...d.data() } as ChatSession;
    },
    enabled: !!tenantId && !!userId && !!itemId,
    staleTime: 10 * 1000,
  });
}

/** Fetch all chat sessions for an item (one item -> many sessions) */
export function useItemChatSessions(
  tenantId: string | null,
  userId: string | null,
  itemId: string | null,
) {
  return useQuery<ChatSession[]>({
    queryKey: ['tenants', tenantId, 'chatSessions', userId, itemId, 'all'],
    queryFn: async () => {
      if (!tenantId || !userId || !itemId) return [];
      const { db } = getFirebaseServices();
      const colRef = collection(db, `tenants/${tenantId}/chatSessions`);
      const q = query(
        colRef,
        where('userId', '==', userId),
        where('itemId', '==', itemId),
        orderBy('updatedAt', 'desc'),
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChatSession));
    },
    enabled: !!tenantId && !!userId && !!itemId,
    staleTime: 30 * 1000,
  });
}

export function useSendChatMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      tenantId: string;
      spaceId: string;
      storyPointId: string;
      itemId: string;
      message: string;
      sessionId?: string;
      language?: string;
    }) => {
      return callSendChatMessage(params);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['tenants', variables.tenantId, 'chatSessions'],
      });
    },
  });
}
