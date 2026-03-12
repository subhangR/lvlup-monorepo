import { Link } from 'react-router-dom';
import { useAuthStore } from '@levelup/shared-stores';
import { useSpaces } from '@levelup/shared-hooks';
import { useStoryPoints } from '../hooks/useStoryPoints';
import { ClipboardList, Clock, ChevronRight, PlayCircle, CalendarClock, Lock } from 'lucide-react';
import { Skeleton, Badge } from '@levelup/shared-ui';
import type { StoryPoint } from '@levelup/shared-types';

function getScheduleStatus(config: StoryPoint['assessmentConfig']): {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
} | null {
  const schedule = config?.schedule;
  if (!schedule) return null;
  const now = Date.now();
  const startMs = schedule.startAt
    ? (schedule.startAt as unknown as { seconds: number }).seconds * 1000
    : null;
  const endMs = schedule.endAt
    ? (schedule.endAt as unknown as { seconds: number }).seconds * 1000
    : null;

  if (startMs && now < startMs) {
    return { label: 'Scheduled', variant: 'secondary' };
  }
  if (endMs && now > endMs) {
    return { label: 'Closed', variant: 'destructive' };
  }
  if (startMs || endMs) {
    return { label: 'Active', variant: 'default' };
  }
  return null;
}

function TestCard({
  storyPoint,
  spaceId,
  spaceTitle,
}: {
  storyPoint: StoryPoint;
  spaceId: string;
  spaceTitle: string;
}) {
  const config = storyPoint.assessmentConfig;
  const scheduleStatus = getScheduleStatus(config);

  return (
    <Link
      to={`/spaces/${spaceId}/test/${storyPoint.id}`}
      className="flex items-center gap-4 rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
        {scheduleStatus?.label === 'Closed' ? (
          <Lock className="h-5 w-5 text-muted-foreground" />
        ) : scheduleStatus?.label === 'Scheduled' ? (
          <CalendarClock className="h-5 w-5 text-blue-500" />
        ) : (
          <PlayCircle className="h-5 w-5 text-destructive" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium truncate">{storyPoint.title}</h3>
          {scheduleStatus && (
            <Badge variant={scheduleStatus.variant} className="text-xs">
              {scheduleStatus.label}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{spaceTitle}</p>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          {config?.durationMinutes && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {config.durationMinutes} min
            </span>
          )}
          {storyPoint.stats?.totalQuestions != null && (
            <span>{storyPoint.stats.totalQuestions} questions</span>
          )}
          {config?.maxAttempts && (
            <span>Max {config.maxAttempts} attempts</span>
          )}
          {scheduleStatus?.label === 'Scheduled' && config?.schedule?.startAt && (
            <span className="text-blue-600 dark:text-blue-400">
              Opens {new Date(
                (config.schedule.startAt as unknown as { seconds: number }).seconds * 1000,
              ).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    </Link>
  );
}

function SpaceTests({ tenantId, space }: { tenantId: string; space: { id: string; title: string } }) {
  const { data: storyPoints } = useStoryPoints(tenantId, space.id);
  const tests = storyPoints?.filter(
    (sp) => sp.type === 'timed_test' || sp.type === 'test',
  ) ?? [];

  if (tests.length === 0) return null;

  return (
    <>
      {tests.map((sp) => (
        <TestCard
          key={sp.id}
          storyPoint={sp}
          spaceId={space.id}
          spaceTitle={space.title}
        />
      ))}
    </>
  );
}

export default function TestsPage() {
  const { currentTenantId, currentMembership } = useAuthStore();
  const classIds = currentMembership?.permissions?.managedClassIds;
  const { data: spaces, isLoading } = useSpaces(currentTenantId, { status: 'published', classIds });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ClipboardList className="h-6 w-6 text-destructive" />
        <div>
          <h1 className="text-2xl font-bold">Tests</h1>
          <p className="text-sm text-muted-foreground">
            All available timed tests across your spaces
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      ) : !spaces || spaces.length === 0 ? (
        <div className="rounded-lg border bg-muted/50 p-8 text-center text-muted-foreground">
          <ClipboardList className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
          <p className="text-sm">No tests available yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {spaces.map((space) => (
            <SpaceTests
              key={space.id}
              tenantId={currentTenantId!}
              space={space}
            />
          ))}
        </div>
      )}
    </div>
  );
}
