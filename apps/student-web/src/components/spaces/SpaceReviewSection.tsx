import { useState } from 'react';
import { useAuthStore } from '@levelup/shared-stores';
import { useSpaceReviews, useSaveSpaceReview } from '@levelup/shared-hooks';
import { Button, Skeleton } from '@levelup/shared-ui';
import { Star, MessageSquare, Send } from 'lucide-react';
import type { SpaceRatingAggregate } from '@levelup/shared-types';

interface SpaceReviewSectionProps {
  tenantId: string;
  spaceId: string;
  ratingAggregate?: SpaceRatingAggregate;
}

function StarRating({
  value,
  onChange,
  readonly = false,
  size = 'md',
}: {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md';
}) {
  const [hover, setHover] = useState(0);
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';

  return (
    <div className="flex items-center gap-0.5" role="radiogroup" aria-label={`Rating: ${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role={readonly ? undefined : 'radio'}
          aria-checked={readonly ? undefined : star === value}
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
        >
          <Star
            className={`${starSize} ${
              star <= (hover || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground/30'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function SpaceReviewSection({
  tenantId,
  spaceId,
  ratingAggregate,
}: SpaceReviewSectionProps) {
  const { user } = useAuthStore();
  const userId = user?.uid ?? null;
  const { data: reviews, isLoading } = useSpaceReviews(tenantId, spaceId);
  const saveReview = useSaveSpaceReview();

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // Find user's existing review
  const userReview = reviews?.find((r) => r.userId === userId);

  const handleSubmit = () => {
    if (rating < 1 || !userId) return;
    saveReview.mutate(
      { tenantId, spaceId, rating, comment: comment.trim() || undefined },
      {
        onSuccess: () => {
          setShowForm(false);
          setRating(0);
          setComment('');
        },
      },
    );
  };

  const handleEdit = () => {
    if (userReview) {
      setRating(userReview.rating);
      setComment(userReview.comment ?? '');
    }
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          Reviews
        </h2>
        {ratingAggregate && ratingAggregate.totalReviews > 0 && (
          <div className="flex items-center gap-2">
            <StarRating value={Math.round(ratingAggregate.averageRating)} readonly size="sm" />
            <span className="text-sm font-medium">{ratingAggregate.averageRating}</span>
            <span className="text-xs text-muted-foreground">
              ({ratingAggregate.totalReviews} review{ratingAggregate.totalReviews !== 1 ? 's' : ''})
            </span>
          </div>
        )}
      </div>

      {/* Add/Edit Review */}
      {userId && !showForm && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleEdit}
          className="gap-1.5"
        >
          <Star className="h-3.5 w-3.5" />
          {userReview ? 'Edit Your Review' : 'Write a Review'}
        </Button>
      )}

      {showForm && (
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <p className="text-sm font-medium">Your Rating</p>
          <StarRating value={rating} onChange={setRating} />
          <label htmlFor="review-comment" className="sr-only">Review comment</label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience (optional)"
            aria-label="Review comment"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            rows={3}
          />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={rating < 1 || saveReview.isPending}
              className="gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              {saveReview.isPending ? 'Submitting...' : userReview ? 'Update' : 'Submit'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
        </div>
      ) : !reviews?.length ? (
        <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-lg border bg-card p-3 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{review.userName ?? 'Student'}</span>
                  {review.userId === userId && (
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">You</span>
                  )}
                </div>
                <StarRating value={review.rating} readonly size="sm" />
              </div>
              {review.comment && (
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
