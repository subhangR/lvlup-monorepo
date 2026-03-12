import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface ScoreCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ElementType;
  className?: string;
}

export function ScoreCard({
  label,
  value,
  suffix,
  trend,
  trendValue,
  icon: Icon,
  className,
}: ScoreCardProps) {
  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    trend === 'up'
      ? 'text-green-600 dark:text-green-400'
      : trend === 'down'
        ? 'text-red-600 dark:text-red-400'
        : 'text-muted-foreground';

  return (
    <div className={cn('rounded-lg border bg-card p-4', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {Icon && (
          <div className="rounded-md bg-primary/10 p-2" aria-hidden="true">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-2xl font-bold">{value}</span>
        {suffix && (
          <span className="text-sm text-muted-foreground">{suffix}</span>
        )}
      </div>
      {trend && trendValue && (
        <div className={cn('mt-1 flex items-center gap-1 text-xs', trendColor)}>
          <TrendIcon className="h-3 w-3" aria-hidden="true" />
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}
