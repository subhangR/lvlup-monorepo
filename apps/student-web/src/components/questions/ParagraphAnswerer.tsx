import type { ParagraphData } from '@levelup/shared-types';

interface ParagraphAnswererProps {
  data: ParagraphData;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function ParagraphAnswerer({ data, value = '', onChange, disabled }: ParagraphAnswererProps) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={6}
        placeholder="Write your answer..."
        className="w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus:outline-none disabled:opacity-60 resize-y"
      />
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>{wordCount} words</span>
        <span>
          {data.minLength && `Min: ${data.minLength}`}
          {data.minLength && data.maxLength && ' | '}
          {data.maxLength && `Max: ${data.maxLength} chars`}
        </span>
      </div>
    </div>
  );
}
