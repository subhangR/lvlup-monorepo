import { useMemo } from 'react';
import type { MatchingData } from '@levelup/shared-types';

interface MatchingAnswererProps {
  data: MatchingData;
  value?: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  disabled?: boolean;
}

export default function MatchingAnswerer({ data, value = {}, onChange, disabled }: MatchingAnswererProps) {
  const rightOptions = useMemo(() => {
    return data.pairs.map((p) => ({ id: p.id, text: p.right }));
  }, [data.pairs]);

  const usedRightIds = new Set(Object.values(value));

  const handleChange = (leftPairId: string, rightPairId: string) => {
    const next = { ...value };
    if (rightPairId) {
      next[leftPairId] = rightPairId;
    } else {
      delete next[leftPairId];
    }
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Match each item on the left with its pair on the right.</p>
      {data.pairs.map((pair) => (
        <div key={pair.id} className="flex items-center gap-3">
          <div className="flex-1 rounded border bg-muted/50 p-2 text-sm">
            {pair.left}
          </div>
          <span className="text-muted-foreground">→</span>
          <select
            value={value[pair.id] ?? ''}
            onChange={(e) => handleChange(pair.id, e.target.value)}
            disabled={disabled}
            className="flex-1 rounded border border-input bg-background p-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus:outline-none disabled:opacity-60"
          >
            <option value="">Select match...</option>
            {rightOptions.map((opt) => (
              <option
                key={opt.id}
                value={opt.id}
                disabled={usedRightIds.has(opt.id) && value[pair.id] !== opt.id}
              >
                {opt.text}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
