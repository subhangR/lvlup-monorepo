import { useState } from "react";
import type { DigitalTestSession } from "@levelup/shared-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@levelup/shared-ui";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface AttemptComparisonProps {
  sessions: DigitalTestSession[];
}

export default function AttemptComparison({ sessions }: AttemptComparisonProps) {
  const [leftIdx, setLeftIdx] = useState(sessions.length >= 2 ? sessions.length - 2 : 0);
  const [rightIdx, setRightIdx] = useState(sessions.length - 1);

  const left = sessions[leftIdx];
  const right = sessions[rightIdx];

  if (!left || !right || left.id === right.id) return null;

  const scoreDelta = (right.percentage ?? 0) - (left.percentage ?? 0);
  const answeredDelta = right.answeredQuestions - left.answeredQuestions;
  const timeDeltaAvg =
    (right.analytics?.averageTimePerQuestion ?? 0) - (left.analytics?.averageTimePerQuestion ?? 0);

  const DeltaIcon = ({ value }: { value: number }) => {
    if (value > 0) return <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />;
    if (value < 0) return <TrendingDown className="text-destructive h-3.5 w-3.5" />;
    return <Minus className="text-muted-foreground h-3.5 w-3.5" />;
  };

  return (
    <div className="bg-card rounded-lg border p-4">
      <h2 className="mb-3 text-sm font-semibold">Attempt Comparison</h2>

      <div className="mb-4 flex items-center gap-3">
        <Select value={String(leftIdx)} onValueChange={(v) => setLeftIdx(Number(v))}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sessions.map((s, i) => (
              <SelectItem key={s.id} value={String(i)} disabled={i === rightIdx}>
                Attempt #{s.attemptNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ArrowRight className="text-muted-foreground h-4 w-4 flex-shrink-0" />

        <Select value={String(rightIdx)} onValueChange={(v) => setRightIdx(Number(v))}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sessions.map((s, i) => (
              <SelectItem key={s.id} value={String(i)} disabled={i === leftIdx}>
                Attempt #{s.attemptNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs">Score</p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm">{Math.round(left.percentage ?? 0)}%</span>
            <ArrowRight className="text-muted-foreground h-3 w-3" />
            <span className="text-sm font-semibold">{Math.round(right.percentage ?? 0)}%</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <DeltaIcon value={scoreDelta} />
            <span
              className={`text-xs font-medium ${
                scoreDelta > 0
                  ? "text-emerald-600"
                  : scoreDelta < 0
                    ? "text-destructive"
                    : "text-muted-foreground"
              }`}
            >
              {scoreDelta > 0 ? "+" : ""}
              {Math.round(scoreDelta)}%
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-muted-foreground text-xs">Answered</p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm">
              {left.answeredQuestions}/{left.totalQuestions}
            </span>
            <ArrowRight className="text-muted-foreground h-3 w-3" />
            <span className="text-sm font-semibold">
              {right.answeredQuestions}/{right.totalQuestions}
            </span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <DeltaIcon value={answeredDelta} />
            <span
              className={`text-xs font-medium ${
                answeredDelta > 0
                  ? "text-emerald-600"
                  : answeredDelta < 0
                    ? "text-destructive"
                    : "text-muted-foreground"
              }`}
            >
              {answeredDelta > 0 ? "+" : ""}
              {answeredDelta}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-muted-foreground text-xs">Avg Time/Q</p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm">{left.analytics?.averageTimePerQuestion ?? "--"}s</span>
            <ArrowRight className="text-muted-foreground h-3 w-3" />
            <span className="text-sm font-semibold">
              {right.analytics?.averageTimePerQuestion ?? "--"}s
            </span>
          </div>
          {timeDeltaAvg !== 0 && (
            <div className="flex items-center justify-center gap-1">
              <DeltaIcon value={-timeDeltaAvg} />
              <span
                className={`text-xs font-medium ${
                  timeDeltaAvg < 0
                    ? "text-emerald-600"
                    : timeDeltaAvg > 0
                      ? "text-destructive"
                      : "text-muted-foreground"
                }`}
              >
                {timeDeltaAvg < 0 ? "" : "+"}
                {Math.round(timeDeltaAvg)}s
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Per-question delta */}
      {right.questionOrder && right.questionOrder.length > 0 && (
        <div className="mt-4 border-t pt-3">
          <p className="text-muted-foreground mb-2 text-xs font-medium">Per-Question Delta</p>
          <div className="grid grid-cols-5 gap-1.5 overflow-x-auto sm:grid-cols-10">
            {right.questionOrder.map((qId, i) => {
              const leftSub = left.submissions[qId];
              const rightSub = right.submissions[qId];
              const leftCorrect = leftSub?.correct;
              const rightCorrect = rightSub?.correct;

              let bgClass = "bg-muted text-muted-foreground"; // same or no data
              if (leftCorrect === false && rightCorrect === true) {
                bgClass = "bg-emerald-500 text-white"; // improved
              } else if (leftCorrect === true && rightCorrect === false) {
                bgClass = "bg-destructive text-destructive-foreground"; // declined
              } else if (rightCorrect === true) {
                bgClass =
                  "bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200"; // stayed correct
              }

              return (
                <div
                  key={qId}
                  className={`flex h-8 w-8 items-center justify-center rounded text-xs font-medium ${bgClass}`}
                  title={`Q${i + 1}: ${leftCorrect ? "✓" : "✗"} → ${rightCorrect ? "✓" : "✗"}`}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
          <div className="text-muted-foreground mt-2 flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded bg-emerald-500" /> Improved
            </span>
            <span className="flex items-center gap-1">
              <span className="bg-destructive inline-block h-3 w-3 rounded" /> Declined
            </span>
            <span className="flex items-center gap-1">
              <span className="bg-muted inline-block h-3 w-3 rounded" /> Same
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
