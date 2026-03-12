import { cn } from '../../lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';

export interface MilestoneCardProps {
  title: string;
  description: string;
  current: number;
  target: number;
  completed: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function MilestoneCard({
  title,
  description,
  current,
  target,
  completed,
  icon,
  className,
}: MilestoneCardProps) {
  const progress = target > 0 ? Math.min(100, (current / target) * 100) : 0;

  return (
    <div
      className={cn(
        'flex gap-3 rounded-lg border p-3 transition-colors',
        completed ? 'border-green-500/30 bg-green-50/50 dark:bg-green-950/20' : 'bg-card',
        className,
      )}
      role="listitem"
      aria-label={`${title}: ${completed ? 'completed' : `${current} of ${target}, ${Math.round(progress)}% complete`}`}
    >
      <div className="shrink-0 pt-0.5" aria-hidden="true">
        {icon ?? (completed ? (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        {!completed && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{current} / {target}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div
              className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${title} progress: ${current} of ${target}`}
            >
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
