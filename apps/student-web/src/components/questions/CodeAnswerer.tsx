import type { CodeData } from '@levelup/shared-types';

interface CodeAnswererProps {
  data: CodeData;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function CodeAnswerer({ data, value, onChange, disabled }: CodeAnswererProps) {
  const testCases = data?.testCases ?? [];
  const code = value ?? data.starterCode ?? '';

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-muted-foreground uppercase">
          {data?.language ?? 'code'}
        </span>
        {testCases.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {testCases.filter((tc) => !tc.isHidden).length} visible test case(s)
          </span>
        )}
      </div>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={12}
        spellCheck={false}
        className="w-full rounded-md border border-input px-3 py-2 font-mono text-sm leading-relaxed focus-visible:ring-2 focus-visible:ring-ring focus:outline-none disabled:opacity-60 resize-y bg-zinc-900 dark:bg-zinc-950 text-zinc-100"
      />
      {testCases.filter((tc) => !tc.isHidden).length > 0 && (
        <div className="mt-2 space-y-1">
          <p className="text-xs font-medium">Test Cases:</p>
          {testCases
            .filter((tc) => !tc.isHidden)
            .map((tc) => (
              <div key={tc.id} className="rounded border bg-muted/50 p-2 text-xs font-mono">
                {tc.description && <p className="text-muted-foreground mb-1">{tc.description}</p>}
                <p>Input: {tc.input}</p>
                <p>Expected: {tc.expectedOutput}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
