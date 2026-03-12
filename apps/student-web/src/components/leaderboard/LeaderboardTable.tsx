import { Trophy, Medal, Crown } from 'lucide-react';
import { AnimatedList, AnimatedListItem, CountUp, Pressable } from '@levelup/shared-ui';

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  totalPoints: number;
  rank: number;
  avatarUrl?: string;
  previousRank?: number;
}

function RankChangeIndicator({ current, previous }: { current: number; previous?: number }) {
  if (previous === undefined || previous === current) return null;
  const improved = current < previous;
  return (
    <span
      className={`text-xs font-medium ${improved ? 'text-success' : 'text-destructive'}`}
      aria-label={improved ? `Up ${previous - current} rank` : `Down ${current - previous} rank`}
    >
      {improved ? '▲' : '▼'}
    </span>
  );
}

export function LeaderboardTable({
  entries,
  currentUserId,
}: {
  entries: LeaderboardEntry[];
  currentUserId: string | null;
}) {
  if (entries.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        <Trophy className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" aria-hidden="true" />
        <p>No leaderboard data yet.</p>
      </div>
    );
  }

  return (
    <AnimatedList className="divide-y">
      {entries.map((entry) => {
        const isCurrentUser = entry.userId === currentUserId;
        return (
          <AnimatedListItem key={entry.userId}>
            <Pressable
              as="div"
              hoverScale={1.01}
              pressScale={0.99}
              className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                isCurrentUser
                  ? 'bg-primary/5 ring-1 ring-primary/10 rounded-md'
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="w-8 text-center">
                {entry.rank === 1 ? (
                  <Crown className="mx-auto h-5 w-5 text-yellow-500" aria-hidden="true" />
                ) : entry.rank === 2 ? (
                  <Medal className="mx-auto h-5 w-5 text-muted-foreground" aria-hidden="true" />
                ) : entry.rank === 3 ? (
                  <Medal className="mx-auto h-5 w-5 text-amber-400" aria-hidden="true" />
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">
                    {entry.rank}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium truncate ${isCurrentUser ? 'text-primary' : ''}`}>
                    {entry.displayName}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-primary/70">(You)</span>
                    )}
                  </p>
                  <RankChangeIndicator current={entry.rank} previous={entry.previousRank} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">
                  <CountUp end={entry.totalPoints} duration={0.8} />
                </p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
            </Pressable>
          </AnimatedListItem>
        );
      })}
    </AnimatedList>
  );
}
