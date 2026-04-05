import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { AttemptRecord } from "@levelup/shared-types";

interface AttemptHistoryPanelProps {
  attempts: AttemptRecord[];
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return (
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );
}

function StatusIcon({ correctness }: { correctness: number }) {
  if (correctness >= 1) return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  if (correctness > 0) return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  return <XCircle className="h-4 w-4 text-red-500" />;
}

export default function AttemptHistoryPanel({ attempts }: AttemptHistoryPanelProps) {
  const [expanded, setExpanded] = useState(false);

  if (!attempts || attempts.length === 0) return null;

  const sorted = [...attempts].reverse(); // most recent first
  const best = attempts.reduce((a, b) => (a.score > b.score ? a : b), attempts[0]!);

  return (
    <div className="border-border bg-muted/30 mt-3 rounded-lg border">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="text-foreground hover:bg-muted/50 flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors"
      >
        <div className="flex items-center gap-2">
          <Clock className="text-muted-foreground h-4 w-4" />
          <span>Previous Attempts ({attempts.length})</span>
          <span className="text-muted-foreground text-xs">
            Best: {best.score}/{best.maxScore}
          </span>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {expanded && (
        <div className="border-border max-h-64 space-y-2 overflow-y-auto border-t px-4 py-2">
          {sorted.map((attempt, i) => (
            <div
              key={attempt.attemptNumber}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                i === 0 ? "bg-muted/50" : ""
              }`}
            >
              <StatusIcon correctness={attempt.evaluation?.correctness ?? 0} />
              <span className="text-muted-foreground w-6 font-mono text-xs">
                #{attempt.attemptNumber}
              </span>
              <span className="font-medium">
                {attempt.score}/{attempt.maxScore}
              </span>
              <span className="text-muted-foreground ml-auto text-xs">
                {formatTime(attempt.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
