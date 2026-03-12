import { useState } from 'react';
import { useAuthStore } from '@levelup/shared-stores';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { getFirebaseServices } from '@levelup/shared-services';
import ChatTutorPanel from '../components/chat/ChatTutorPanel';
import type { ChatSession } from '@levelup/shared-types';
import { MessageCircle, Bot, Clock, ChevronRight } from 'lucide-react';
import { Skeleton } from '@levelup/shared-ui';

function useChatSessions(tenantId: string | null, userId: string | null) {
  return useQuery<ChatSession[]>({
    queryKey: ['tenants', tenantId, 'chatSessions', 'all', userId],
    queryFn: async () => {
      if (!tenantId || !userId) return [];
      const { db } = getFirebaseServices();
      const colRef = collection(db, `tenants/${tenantId}/chatSessions`);
      const q = query(
        colRef,
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc'),
        limit(50),
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ChatSession);
    },
    enabled: !!tenantId && !!userId,
    staleTime: 30 * 1000,
  });
}

export default function ChatTutorPage() {
  const { currentTenantId, user } = useAuthStore();
  const userId = user?.uid ?? null;

  const { data: sessions, isLoading } = useChatSessions(currentTenantId, userId);

  const [activeSession, setActiveSession] = useState<{
    spaceId: string;
    storyPointId: string;
    itemId: string;
  } | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageCircle className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Chat Tutor</h1>
          <p className="text-sm text-muted-foreground">
            Browse previous chat sessions or start a new one from any question
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      ) : !sessions || sessions.length === 0 ? (
        <div className="rounded-lg border bg-muted/50 p-8 text-center">
          <Bot className="mx-auto mb-3 h-10 w-10 text-primary/30" />
          <p className="text-sm font-medium">No chat sessions yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Start a conversation with the AI tutor from any question by clicking
            "Ask AI Tutor" while practicing.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const lastMessage = session.messages?.[session.messages.length - 1];
            const updatedAt = session.updatedAt
              ? new Date(session.updatedAt.seconds * 1000)
              : null;

            return (
              <button
                key={session.id}
                onClick={() =>
                  setActiveSession({
                    spaceId: session.spaceId,
                    storyPointId: session.storyPointId,
                    itemId: session.itemId,
                  })
                }
                className="w-full text-left flex items-center gap-4 rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium truncate">
                      {session.sessionTitle ?? `Chat Session`}
                    </h3>
                    {session.isActive && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-400">
                        Active
                      </span>
                    )}
                  </div>
                  {lastMessage && (
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">
                      {lastMessage.role === 'user' ? 'You: ' : 'AI: '}
                      {lastMessage.text}
                    </p>
                  )}
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{session.messageCount ?? session.messages?.length ?? 0} messages</span>
                    {updatedAt && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {updatedAt.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </button>
            );
          })}
        </div>
      )}

      {/* Chat Panel slide-over */}
      {activeSession && (
        <ChatTutorPanel
          spaceId={activeSession.spaceId}
          storyPointId={activeSession.storyPointId}
          itemId={activeSession.itemId}
          onClose={() => setActiveSession(null)}
        />
      )}
    </div>
  );
}
