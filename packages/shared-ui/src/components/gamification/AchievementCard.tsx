import type { KeyboardEvent } from 'react';
import { cn } from '../../lib/utils';
import type { AchievementTier, AchievementCategory } from '@levelup/shared-types';
import { AchievementBadge } from './AchievementBadge';
import { Card, CardContent } from '../ui/card';

export interface AchievementCardProps {
  icon: string;
  title: string;
  description: string;
  tier: AchievementTier;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: AchievementCategory;
  pointsReward: number;
  earned?: boolean;
  earnedAt?: string;
  className?: string;
  /** Callback when the card is clicked or activated via keyboard */
  onActivate?: () => void;
}

const categoryLabels: Record<AchievementCategory, string> = {
  learning: 'Learning',
  consistency: 'Consistency',
  excellence: 'Excellence',
  exploration: 'Exploration',
  social: 'Social',
  milestone: 'Milestone',
};

export function AchievementCard({
  icon,
  title,
  description,
  tier,
  rarity,
  category,
  pointsReward,
  earned = false,
  earnedAt,
  className,
  onActivate,
}: AchievementCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onActivate && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onActivate();
    }
  };

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-md',
        earned && 'ring-1 ring-primary/20',
        onActivate && 'cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        className,
      )}
      role="article"
      aria-label={`${title} achievement, ${tier} tier, ${earned ? 'earned' : 'locked'}${earned && earnedAt ? `, earned ${new Date(earnedAt).toLocaleDateString()}` : ''}`}
      tabIndex={onActivate ? 0 : undefined}
      onClick={onActivate}
      onKeyDown={handleKeyDown}
    >
      <CardContent className="flex gap-4 p-4">
        <AchievementBadge
          icon={icon}
          title={title}
          tier={tier}
          rarity={rarity}
          earned={earned}
          size="lg"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className={cn('font-semibold', !earned && 'text-muted-foreground')}>
              {title}
            </h3>
            <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {categoryLabels[category]}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="capitalize">{tier}</span>
            <span>+{pointsReward} XP</span>
            {earned && earnedAt && (
              <span>
                Earned {new Date(earnedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
            {!earned && (
              <span className="italic">Locked</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
