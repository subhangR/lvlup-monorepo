import { useState } from 'react';
import type { ChatAgentQuestionData } from '@levelup/shared-types';
import { Send } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface ChatAgentAnswererProps {
  data: ChatAgentQuestionData;
  value?: ChatMessage[];
  onChange: (value: ChatMessage[]) => void;
  onSendMessage?: (message: string) => Promise<string>;
  disabled?: boolean;
}

export default function ChatAgentAnswerer({
  data,
  value = [],
  onChange,
  onSendMessage,
  disabled,
}: ChatAgentAnswererProps) {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const maxTurns = data.maxTurns ?? 20;
  const userMessages = value.filter((m) => m.role === 'user').length;
  const canSend = userMessages < maxTurns && !sending && input.trim() && !disabled;

  const handleSend = async () => {
    if (!canSend) return;
    const message = input.trim();
    setInput('');
    const updated = [...value, { role: 'user' as const, text: message }];
    onChange(updated);
    setSending(true);

    try {
      if (onSendMessage) {
        const reply = await onSendMessage(message);
        onChange([...updated, { role: 'assistant' as const, text: reply }]);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-lg border">
      {/* Objectives */}
      {data.objectives.length > 0 && (
        <div className="border-b bg-muted/50 p-3">
          <p className="text-xs font-medium text-muted-foreground">Objectives:</p>
          <ul className="list-disc pl-4 text-xs text-muted-foreground">
            {data.objectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Chat messages */}
      <div className="h-64 overflow-y-auto p-3 space-y-3" role="log" aria-live="polite" aria-label="Chat messages">
        {value.length === 0 && data.conversationStarters && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Suggested starters:</p>
            {data.conversationStarters.map((starter, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setInput(starter);
                }}
                disabled={disabled}
                className="block w-full text-left rounded border px-3 py-2 text-sm hover:bg-accent disabled:opacity-60"
              >
                {starter}
              </button>
            ))}
          </div>
        )}

        {value.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-3 py-2 text-sm text-muted-foreground animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={userMessages >= maxTurns ? 'Max turns reached' : 'Type your message...'}
          disabled={disabled || userMessages >= maxTurns}
          className="flex-1 rounded-md border border-input px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus:outline-none disabled:opacity-60"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className="rounded-md bg-primary p-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      <div className="px-3 pb-2 text-xs text-muted-foreground">
        {userMessages}/{maxTurns} messages used
      </div>
    </div>
  );
}
