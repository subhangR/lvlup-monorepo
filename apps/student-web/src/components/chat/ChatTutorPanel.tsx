import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@levelup/shared-stores';
import { useChatSession, useItemChatSessions, useSendChatMessage } from '../../hooks/useChatTutor';
import { Send, Bot, User, X, Minimize2, Plus, ChevronLeft } from 'lucide-react';
import { Input, Button } from '@levelup/shared-ui';

interface ChatTutorPanelProps {
  spaceId: string;
  storyPointId: string;
  itemId: string;
  onClose: () => void;
}

export default function ChatTutorPanel({ spaceId, storyPointId, itemId, onClose }: ChatTutorPanelProps) {
  const { currentTenantId, user } = useAuthStore();
  const userId = user?.uid ?? null;
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showSessionList, setShowSessionList] = useState(false);

  const { data: session } = useChatSession(currentTenantId, userId, itemId, activeSessionId);
  const { data: allSessions } = useItemChatSessions(currentTenantId, userId, itemId);
  const sendMessage = useSendChatMessage();

  const [input, setInput] = useState('');
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = session?.messages ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !currentTenantId) return;
    setInput('');

    sendMessage.mutate({
      tenantId: currentTenantId,
      spaceId,
      storyPointId,
      itemId,
      message: text,
      sessionId: activeSessionId ?? session?.id,
    });
  };

  const startNewSession = () => {
    setActiveSessionId(null);
    setShowSessionList(false);
    // Sending a message without sessionId creates a new session
  };

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="sm"
          onClick={() => setMinimized(false)}
          className="gap-2 shadow-lg"
        >
          <Bot className="h-4 w-4" /> AI Tutor
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 w-96 max-w-[calc(100vw-1rem)] h-[500px] max-h-[70vh] flex flex-col rounded-t-xl border border-b-0 bg-background shadow-xl sm:bottom-4 sm:right-4 sm:rounded-xl sm:border-b">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm font-semibold">
          {showSessionList ? (
            <button
              type="button"
              onClick={() => setShowSessionList(false)}
              className="flex items-center gap-1 hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <>
              <Bot className="h-5 w-5 text-primary" />
              AI Tutor
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!showSessionList && allSessions && allSessions.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => setShowSessionList(true)}
            >
              Sessions ({allSessions.length})
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setMinimized(true)}>
            <Minimize2 className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {showSessionList ? (
        /* Session List View */
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-1.5"
            onClick={startNewSession}
          >
            <Plus className="h-3.5 w-3.5" /> New Session
          </Button>
          {allSessions?.map((s) => {
            const lastMessage = s.messages?.[s.messages.length - 1];
            const isActive = s.id === (activeSessionId ?? session?.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setActiveSessionId(s.id);
                  setShowSessionList(false);
                }}
                className={`w-full text-left rounded-lg border p-3 hover:bg-accent transition-colors ${
                  isActive ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <p className="text-xs text-muted-foreground">
                  {s.messages?.length ?? 0} messages
                </p>
                {lastMessage && (
                  <p className="text-sm truncate mt-0.5">
                    {lastMessage.text}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        /* Chat View */
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-3" role="log" aria-label="Chat messages">
            {messages.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-8">
                <Bot className="h-8 w-8 mx-auto mb-2 text-primary/30" />
                <p>Ask me anything about this question!</p>
                <p className="text-xs mt-1">I'll guide you without giving away the answer.</p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <Bot className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <User className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1" />
                )}
              </div>
            ))}

            {sendMessage.isPending && (
              <div className="flex gap-2">
                <Bot className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask the AI tutor..."
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || sendMessage.isPending}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
