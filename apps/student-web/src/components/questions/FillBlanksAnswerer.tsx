import type { FillBlanksData } from "@levelup/shared-types";

interface FillBlanksAnswererProps {
  data: FillBlanksData;
  value?: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  disabled?: boolean;
}

export default function FillBlanksAnswerer({
  data,
  value = {},
  onChange,
  disabled,
}: FillBlanksAnswererProps) {
  const handleBlankChange = (blankId: string, text: string) => {
    onChange({ ...value, [blankId]: text });
  };

  // Split textWithBlanks by blank placeholders like {{blank_id}}
  if (!data.textWithBlanks) {
    return (
      <p className="text-muted-foreground text-sm">No fill-in-the-blanks content configured.</p>
    );
  }
  const parts = data.textWithBlanks.split(/(\{\{[^}]+\}\})/g);

  return (
    <div className="text-sm leading-relaxed">
      {parts.map((part, index) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          const blankId = match[1]!;
          return (
            <input
              key={blankId}
              type="text"
              value={value[blankId] ?? ""}
              onChange={(e) => handleBlankChange(blankId, e.target.value)}
              disabled={disabled}
              placeholder="___"
              className="border-input focus-visible:ring-ring mx-1 inline-block w-32 border-b-2 bg-transparent px-1 text-center text-sm focus:outline-none focus-visible:ring-2 disabled:opacity-60"
            />
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
}
