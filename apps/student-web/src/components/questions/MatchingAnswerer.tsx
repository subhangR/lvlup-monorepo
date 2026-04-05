import { useMemo } from "react";
import type { MatchingData } from "@levelup/shared-types";

interface MatchingAnswererProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: MatchingData | any;
  value?: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  disabled?: boolean;
}

interface NormalizedItem {
  id: string;
  text: string;
}

/**
 * Normalizes both data formats into a common {leftItems, rightOptions} shape.
 * Supports:
 *  - Standard MatchingData: { pairs: [{id, left, right}] }
 *  - Legacy seed format:    { leftItems: [{id, text}], rightItems: [{id, text}], correctPairs: [...] }
 * Also assigns fallback IDs if any items are missing them.
 */
function normalizeMatchingData(data: unknown): {
  leftItems: NormalizedItem[];
  rightOptions: NormalizedItem[];
} {
  if (!data || typeof data !== "object") return { leftItems: [], rightOptions: [] };
  const d = data as Record<string, unknown>;

  let leftItems: NormalizedItem[] = [];
  let rightOptions: NormalizedItem[] = [];

  // Standard pairs format
  if (Array.isArray(d.pairs) && d.pairs.length > 0) {
    leftItems = d.pairs.map((p: Record<string, unknown>, idx: number) => ({
      id: (p.id as string) || `left_${idx}`,
      text: (p.left as string) || "",
    }));
    rightOptions = d.pairs.map((p: Record<string, unknown>, idx: number) => ({
      id: (p.id as string) || `right_${idx}`,
      text: (p.right as string) || "",
    }));
  }
  // Legacy leftItems/rightItems format
  else if (Array.isArray(d.leftItems) && Array.isArray(d.rightItems)) {
    leftItems = (d.leftItems as Record<string, unknown>[]).map((li, idx) => ({
      id: (li.id as string) || `left_${idx}`,
      text: (li.text as string) || "",
    }));
    rightOptions = (d.rightItems as Record<string, unknown>[]).map((ri, idx) => ({
      id: (ri.id as string) || `right_${idx}`,
      text: (ri.text as string) || "",
    }));
  }

  // Ensure left item IDs are unique — if duplicates exist, append index
  const seenIds = new Set<string>();
  leftItems = leftItems.map((item, idx) => {
    if (seenIds.has(item.id)) {
      return { ...item, id: `${item.id}_${idx}` };
    }
    seenIds.add(item.id);
    return item;
  });

  return { leftItems, rightOptions };
}

export default function MatchingAnswerer({
  data,
  value = {},
  onChange,
  disabled,
}: MatchingAnswererProps) {
  const { leftItems, rightOptions } = useMemo(() => normalizeMatchingData(data), [data]);

  // Debug log — remove after confirming fix
  console.log("[MatchingAnswerer] data:", JSON.stringify(data));
  console.log(
    "[MatchingAnswerer] leftItems:",
    leftItems,
    "rightOptions:",
    rightOptions,
    "value:",
    value
  );

  const usedRightIds = new Set(Object.values(value));

  const handleChange = (leftId: string, rightId: string) => {
    const next = { ...value };
    if (rightId) {
      next[leftId] = rightId;
    } else {
      delete next[leftId];
    }
    console.log("[MatchingAnswerer] handleChange:", leftId, rightId, "→ next:", next);
    onChange(next);
  };

  if (leftItems.length === 0) {
    return <p className="text-muted-foreground text-sm">No matching pairs configured.</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-xs">
        Match each item on the left with its pair on the right.
      </p>
      {leftItems.map((left, idx) => (
        <div key={`${left.id}-${idx}`} className="flex items-center gap-3">
          <div className="bg-muted/50 flex-1 rounded border p-2 text-sm">{left.text}</div>
          <span className="text-muted-foreground">→</span>
          <select
            value={value[left.id] ?? ""}
            onChange={(e) => handleChange(left.id, e.target.value)}
            disabled={disabled}
            className="border-input bg-background focus-visible:ring-ring flex-1 rounded border p-2 text-sm focus:outline-none focus-visible:ring-2 disabled:opacity-60"
          >
            <option value="">Select match...</option>
            {rightOptions.map((opt, optIdx) => (
              <option
                key={`${opt.id}-${optIdx}`}
                value={opt.id}
                disabled={usedRightIds.has(opt.id) && value[left.id] !== opt.id}
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
