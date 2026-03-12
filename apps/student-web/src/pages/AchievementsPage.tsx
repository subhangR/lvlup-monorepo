import { useState, useEffect, useRef } from 'react';
import { useCurrentUser, useCurrentTenantId } from '@levelup/shared-stores';
import { useAchievements, useStudentAchievements, useStudentLevel } from '@levelup/shared-hooks';
import {
  AchievementCard,
  LevelBadge,
  StreakWidget,
  Skeleton,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  FadeIn,
  AnimatedList,
  AnimatedListItem,
  EmptyState,
  CelebrationBurst,
} from '@levelup/shared-ui';
import { useStudentProgressSummary } from '@levelup/shared-hooks';
import type { AchievementCategory } from '@levelup/shared-types';
import { Trophy } from 'lucide-react';

const categories: { value: AchievementCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'learning', label: 'Learning' },
  { value: 'consistency', label: 'Consistency' },
  { value: 'excellence', label: 'Excellence' },
  { value: 'exploration', label: 'Exploration' },
  { value: 'social', label: 'Social' },
  { value: 'milestone', label: 'Milestone' },
];

export default function AchievementsPage() {
  const user = useCurrentUser();
  const tenantId = useCurrentTenantId();
  const [categoryFilter, setCategoryFilter] = useState<AchievementCategory | 'all'>('all');

  const { data: allAchievements, isLoading: achievementsLoading } = useAchievements(tenantId);
  const { data: earned, isLoading: earnedLoading } = useStudentAchievements(tenantId, user?.uid ?? null);
  const { data: level, isLoading: levelLoading } = useStudentLevel(tenantId, user?.uid ?? null);
  const { data: summary } = useStudentProgressSummary(tenantId, user?.uid ?? null);

  const earnedIds = new Set(earned?.map((e) => e.achievementId) ?? []);
  const earnedMap = new Map(earned?.map((e) => [e.achievementId, e]) ?? []);

  const filteredAchievements = (allAchievements ?? []).filter(
    (a) => categoryFilter === 'all' || a.category === categoryFilter,
  );

  // Sort: earned first, then by tier
  const tierOrder = { diamond: 0, platinum: 1, gold: 2, silver: 3, bronze: 4 };
  const sorted = [...filteredAchievements].sort((a, b) => {
    const aEarned = earnedIds.has(a.id) ? 0 : 1;
    const bEarned = earnedIds.has(b.id) ? 0 : 1;
    if (aEarned !== bEarned) return aEarned - bEarned;
    return (tierOrder[a.tier] ?? 5) - (tierOrder[b.tier] ?? 5);
  });

  const isLoading = achievementsLoading || earnedLoading || levelLoading;

  // Show celebration once per session when user has newly earned achievements
  const [showCelebration, setShowCelebration] = useState(false);
  const celebrationChecked = useRef(false);

  useEffect(() => {
    if (celebrationChecked.current || isLoading || !earned?.length) return;
    celebrationChecked.current = true;

    const key = `ach_celebrated_${user?.uid}`;
    const lastCount = parseInt(sessionStorage.getItem(key) ?? '0', 10);
    if (earned.length > lastCount) {
      setShowCelebration(true);
      sessionStorage.setItem(key, String(earned.length));
    }
  }, [isLoading, earned, user?.uid]);

  return (
    <div className="space-y-6">
      <CelebrationBurst
        trigger={showCelebration}
        variant="stars"
        particleCount={32}
        onComplete={() => setShowCelebration(false)}
      />
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" aria-hidden="true" />
            Achievements
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {earned?.length ?? 0} earned out of {allAchievements?.length ?? 0} total
          </p>
        </div>
      </FadeIn>

      {/* Level & Streak Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {level && (
          <LevelBadge
            level={level.level}
            currentXP={level.currentXP}
            xpToNextLevel={level.xpToNextLevel}
            tier={level.tier}
          />
        )}
        {summary && (
          <StreakWidget
            currentStreak={summary.levelup.streakDays}
          />
        )}
      </div>

      {/* Category Filter */}
      <Tabs
        value={categoryFilter}
        onValueChange={(v) => setCategoryFilter(v as AchievementCategory | 'all')}
      >
        <TabsList className="flex-wrap">
          {categories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat.value} value={cat.value}>
            {/* Achievement content is rendered below tabs */}
          </TabsContent>
        ))}
      </Tabs>

      {/* Achievement Grid */}
      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No achievements in this category"
          description="Keep learning and you'll unlock achievements here!"
        />
      ) : (
        <AnimatedList className="grid gap-3 md:grid-cols-2">
          {sorted.map((achievement) => {
            const studentAch = earnedMap.get(achievement.id);
            return (
              <AnimatedListItem key={achievement.id}>
                <AchievementCard
                  icon={achievement.icon}
                  title={achievement.title}
                  description={achievement.description}
                  tier={achievement.tier}
                  rarity={achievement.rarity}
                  category={achievement.category}
                  pointsReward={achievement.pointsReward}
                  earned={!!studentAch}
                  earnedAt={
                    studentAch?.earnedAt
                      ? typeof studentAch.earnedAt === 'object' && 'seconds' in studentAch.earnedAt
                        ? new Date((studentAch.earnedAt as { seconds: number }).seconds * 1000).toISOString()
                        : undefined
                      : undefined
                  }
                />
              </AnimatedListItem>
            );
          })}
        </AnimatedList>
      )}
    </div>
  );
}
