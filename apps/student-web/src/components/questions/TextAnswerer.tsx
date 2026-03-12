import type { TextData } from '@levelup/shared-types';

interface TextAnswererProps {
  data: TextData;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function TextAnswerer({ data, value = '', onChange, disabled }: TextAnswererProps) {
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        maxLength={data.maxLength}
        placeholder="Type your answer"
        className="w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus:outline-none disabled:opacity-60"
      />
      {data.maxLength && (
        <p className="mt-1 text-xs text-muted-foreground text-right">
          {value.length}/{data.maxLength}
        </p>
      )}
    </div>
  );
}
