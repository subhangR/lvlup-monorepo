import { useState } from 'react';
import type { DigitalTestSession } from '@levelup/shared-types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from '@levelup/shared-ui';
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AttemptComparisonProps {
  sessions: DigitalTestSession[];
}

export default function AttemptComparison({ sessions }: AttemptComparisonProps) {
  const [leftIdx, setLeftIdx] = useState(
    sessions.length >= 2 ? sessions.length - 2 : 0,
  );
  const [rightIdx, setRightIdx] = useState(sessions.length - 1);

  const left = sessions[leftIdx];
  const right = sessions[rightIdx];

  if (!left || !right || left.id === right.id) return null;

  const scoreDelta = (right.percentage ?? 0) - (left.percentage ?? 0);
  const answeredDelta = right.answeredQuestions - left.answeredQuestions;
  const timeDeltaAvg =
    (right.analytics?.averageTimePerQuestion ?? 0) -
    (left.analytics?.averageTimePerQuestion ?? 0);

  const DeltaIcon = ({ value }: { value: number }) => {
    if (value > 0) return <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />;
    if (value < 0) return <TrendingDown className="h-3.5 w-3.5 text-destructive" />;
    return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      <h2 className="text-sm font-semibold mb-3">Attempt Comparison</h2>

      <div className="flex items-center gap-3 mb-4">
        <Select
          value={String(leftIdx)}
          onValueChange={(v) => setLeftIdx(Number(v))}
        >
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

        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />

        <Select
          value={String(rightIdx)}
          onValueChange={(v) => setRightIdx(Number(v))}
        >
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
          <p className="text-xs text-muted-foreground">Score</p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm">{Math.round(left.percentage ?? 0)}%</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-semibold">{Math.round(right.percentage ?? 0)}%</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <DeltaIcon value={scoreDelta} />
            <span className={`text-xs font-medium ${
              scoreDelta > 0 ? 'text-emerald-600' : scoreDelta < 0 ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {scoreDelta > 0 ? '+' : ''}{Math.round(scoreDelta)}%
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Answered</p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm">{left.answeredQuestions}/{left.totalQuestions}</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-semibold">{right.answeredQuestions}/{right.totalQuestions}</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <DeltaIcon value={answeredDelta} />
            <span className={`text-xs font-medium ${
              answeredDelta > 0 ? 'text-emerald-600' : answeredDelta < 0 ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {answeredDelta > 0 ? '+' : ''}{answeredDelta}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Avg Time/Q</p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm">{left.analytics?.averageTimePerQuestion ?? '--'}s</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-semibold">{right.analytics?.averageTimePerQuestion ?? '--'}s</span>
          </div>
          {timeDeltaAvg !== 0 && (
            <div className="flex items-center justify-center gap-1">
              <DeltaIcon value={-timeDeltaAvg} />
              <span className={`text-xs font-medium ${
                timeDeltaAvg < 0 ? 'text-emerald-600' : timeDeltaAvg > 0 ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {timeDeltaAvg < 0 ? '' : '+'}{Math.round(timeDeltaAvg)}s
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Per-question delta */}
      {right.questionOrder && right.questionOrder.length > 0 && (
        <div className="mt-4 pt-3 border-t">
          <p className="text-xs font-medium text-muted-foreground mb-2">Per-Question Delta</p>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 overflow-x-auto">
            {right.questionOrder.map((qId, i) => {
              const leftSub = left.submissions[qId];
              const rightSub = right.submissions[qId];
              const leftCorrect = leftSub?.correct;
              const rightCorrect = rightSub?.correct;

              let bgClass = 'bg-muted text-muted-foreground'; // same or no data
              if (leftCorrect === false && rightCorrect === true) {
                bgClass = 'bg-emerald-500 text-white'; // improved
              } else if (leftCorrect === true && rightCorrect === false) {
                bgClass = 'bg-destructive text-destructive-foreground'; // declined
              } else if (rightCorrect === true) {
                bgClass = 'bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200'; // stayed correct
              }

              return (
                <div
                  key={qId}
                  className={`h-8 w-8 rounded text-xs font-medium flex items-center justify-center ${bgClass}`}
                  title={`Q${i + 1}: ${leftCorrect ? '✓' : '✗'} → ${rightCorrect ? '✓' : '✗'}`}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-emerald-500 inline-block" /> Improved
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-destructive inline-block" /> Declined
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-muted inline-block" /> Same
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
