import { Link } from 'react-router-dom';
import { useAuthStore } from '@levelup/shared-stores';
import { useSpaces, useProgress } from '@levelup/shared-hooks';
import ProgressBar from '../components/common/ProgressBar';
import { BookOpen, AlertCircle, RefreshCw, Star } from 'lucide-react';
import { Skeleton, Button } from '@levelup/shared-ui';
import type { Space } from '@levelup/shared-types';

export default function SpacesListPage() {
  const { currentTenantId, user, currentMembership } = useAuthStore();
  const classIds = currentMembership?.permissions?.managedClassIds;
  const { data: spaces, isLoading, isError, refetch } = useSpaces(currentTenantId, { status: 'published', classIds });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">My Spaces</h1>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">My Spaces</h1>
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
          <AlertCircle className="h-10 w-10 mx-auto mb-2 text-destructive/60" />
          <p className="text-sm font-medium text-destructive">Failed to load spaces</p>
          <p className="text-xs text-muted-foreground mt-1">Check your connection and try again.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3 gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Spaces</h1>
      {!spaces?.length ? (
        <div className="rounded-lg border bg-muted/50 p-8 text-center text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
          <p className="font-medium">No spaces assigned yet</p>
          <p className="text-xs mt-1">Your teacher will assign learning spaces to your class. Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {spaces.map((space) => (
            <SpaceCard key={space.id} space={space} tenantId={currentTenantId!} userId={user?.uid ?? ''} />
          ))}
        </div>
      )}
    </div>
  );
}

function SpaceCard({ space, tenantId, userId }: { space: Space; tenantId: string; userId: string }) {
  const { data: progress } = useProgress(tenantId, userId, space.id);
  const percentage = progress?.percentage ?? 0;

  return (
    <Link
      to={`/spaces/${space.id}`}
      className="block rounded-lg border bg-card p-4 hover:shadow-md transition-shadow"
    >
      {space.thumbnailUrl && (
        <img
          src={space.thumbnailUrl}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-32 object-cover rounded-md mb-3"
        />
      )}
      <h3 className="font-semibold text-sm line-clamp-1">{space.title}</h3>
      {space.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{space.description}</p>
      )}
      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
        {space.subject && <span>{space.subject}</span>}
        {space.stats && (
          <>
            <span>{space.stats.totalStoryPoints} sections</span>
            <span>{space.stats.totalItems} items</span>
          </>
        )}
        {space.ratingAggregate && space.ratingAggregate.totalReviews > 0 && (
          <span className="flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {space.ratingAggregate.averageRating}
          </span>
        )}
      </div>
      <div className="mt-3">
        <ProgressBar value={percentage} size="sm" color={percentage === 100 ? 'green' : 'blue'} />
      </div>
    </Link>
  );
}
