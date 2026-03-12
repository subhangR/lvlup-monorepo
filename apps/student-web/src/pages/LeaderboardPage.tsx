import { useState } from 'react';
import { useAuthStore } from '@levelup/shared-stores';
import { useSpaces } from '@levelup/shared-hooks';
import { useRealtimeDB } from '@levelup/shared-hooks';
import { Trophy } from 'lucide-react';
import {
  Skeleton,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  FadeIn,
  AnimatedList,
  AnimatedListItem,
  CountUp,
  Pressable,
} from '@levelup/shared-ui';
import { LeaderboardTable, type LeaderboardEntry } from '../components/leaderboard/LeaderboardTable';

export default function LeaderboardPage() {
  const { currentTenantId, user, currentMembership } = useAuthStore();
  const userId = user?.uid ?? null;
  const classIds = currentMembership?.permissions?.managedClassIds;

  const { data: spaces, isLoading: spacesLoading } = useSpaces(currentTenantId, {
    status: 'published',
    classIds,
  });

  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);

  // Subscribe to RTDB leaderboard data for the selected space
  const rtdbPath = selectedSpaceId
    ? `leaderboards/${selectedSpaceId}`
    : 'leaderboards/overall';

  const { data: leaderboardData, loading: lbLoading } = useRealtimeDB<
    Record<string, Omit<LeaderboardEntry, 'rank'>>
  >(currentTenantId ?? '', rtdbPath, {
    disabled: !currentTenantId,
  });

  // Transform RTDB data into ranked entries
  const entries: LeaderboardEntry[] = leaderboardData
    ? Object.entries(leaderboardData)
        .map(([uid, data]) => ({
          userId: uid,
          displayName: data.displayName ?? uid,
          totalPoints: data.totalPoints ?? 0,
          avatarUrl: data.avatarUrl,
          rank: 0,
        }))
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .map((entry, idx) => ({ ...entry, rank: idx + 1 }))
    : [];

  // Find current user's rank
  const currentUserEntry = entries.find((e) => e.userId === userId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-yellow-500" aria-hidden="true" />
            <div>
              <h1 className="text-2xl font-bold">Leaderboard</h1>
              <p className="text-sm text-muted-foreground">
                See how you rank against your classmates
              </p>
            </div>
          </div>
          {currentUserEntry && (
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                #<CountUp end={currentUserEntry.rank} duration={0.6} />
              </p>
              <p className="text-xs text-muted-foreground">Your Rank</p>
            </div>
          )}
        </div>
      </FadeIn>

      {/* Space filter */}
      <FadeIn delay={0.1}>
      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground">Filter by space:</label>
        <Select
          value={selectedSpaceId ?? 'all'}
          onValueChange={(v) => setSelectedSpaceId(v === 'all' ? null : v)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Overall" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Overall</SelectItem>
            {(spaces ?? []).map((space) => (
              <SelectItem key={space.id} value={space.id}>
                {space.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      </FadeIn>

      {/* Leaderboard table */}
      <div className="rounded-lg border bg-card">
        <div className="border-b px-5 py-3">
          <h2 className="text-sm font-semibold">
            {selectedSpaceId
              ? spaces?.find((s) => s.id === selectedSpaceId)?.title ?? 'Space'
              : 'Overall'}{' '}
            Rankings
          </h2>
        </div>
        {spacesLoading || lbLoading ? (
          <div className="space-y-2 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 rounded" />
            ))}
          </div>
        ) : (
          <LeaderboardTable entries={entries} currentUserId={userId} />
        )}
      </div>
    </div>
  );
}
