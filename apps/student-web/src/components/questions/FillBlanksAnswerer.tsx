import type { FillBlanksData } from '@levelup/shared-types';

interface FillBlanksAnswererProps {
  data: FillBlanksData;
  value?: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  disabled?: boolean;
}

export default function FillBlanksAnswerer({ data, value = {}, onChange, disabled }: FillBlanksAnswererProps) {
  const handleBlankChange = (blankId: string, text: string) => {
    onChange({ ...value, [blankId]: text });
  };

  // Split textWithBlanks by blank placeholders like {{blank_id}}
  const parts = data.textWithBlanks.split(/(\{\{[^}]+\}\})/g);

  return (
    <div className="leading-relaxed text-sm">
      {parts.map((part, index) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          const blankId = match[1]!;
          return (
            <input
              key={blankId}
              type="text"
              value={value[blankId] ?? ''}
              onChange={(e) => handleBlankChange(blankId, e.target.value)}
              disabled={disabled}
              placeholder="___"
              className="inline-block w-32 mx-1 border-b-2 border-input bg-transparent px-1 text-sm text-center focus-visible:ring-2 focus-visible:ring-ring focus:outline-none disabled:opacity-60"
            />
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
}
