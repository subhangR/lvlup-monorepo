import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFirebaseServices, callPurchaseSpace } from "@levelup/shared-services";
import { useAuthStore, useConsumerStore } from "@levelup/shared-stores";
import { Skeleton, Button } from "@levelup/shared-ui";
import type { Space } from "@levelup/shared-types";
import {
  ArrowLeft,
  BookOpen,
  Users,
  CheckCircle2,
  ShoppingCart,
  Tag,
  Clock,
  Star,
  ListOrdered,
} from "lucide-react";

const PLATFORM_PUBLIC_TENANT_ID = "platform_public";

export default function StoreDetailPage() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const { addToCart, removeFromCart, isInCart } = useConsumerStore();
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const enrolled = user?.consumerProfile?.enrolledSpaceIds?.includes(spaceId ?? "") ?? false;
  const inCart = isInCart(spaceId ?? "");

  // Fetch space details
  const { data: space, isLoading, error } = useQuery({
    queryKey: ["store-space", spaceId],
    queryFn: async () => {
      const { db: firestore } = getFirebaseServices();
      const ref = doc(firestore, `tenants/${PLATFORM_PUBLIC_TENANT_ID}/spaces/${spaceId}`);
      const snap = await getDoc(ref);
      if (!snap.exists()) throw new Error("Space not found");
      return { id: snap.id, ...snap.data() } as Space;
    },
    enabled: !!spaceId,
    staleTime: 30 * 1000,
  });

  // Fetch story points (content preview)
  const { data: storyPoints } = useQuery({
    queryKey: ["store-space-content", spaceId],
    queryFn: async () => {
      const { db: firestore } = getFirebaseServices();
      const ref = collection(
        firestore,
        `tenants/${PLATFORM_PUBLIC_TENANT_ID}/spaces/${spaceId}/storyPoints`,
      );
      const q = query(ref, orderBy("orderIndex", "asc"));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({
        id: d.id,
        title: d.data().title ?? "Untitled",
        type: d.data().type ?? "lesson",
        estimatedMinutes: d.data().estimatedMinutes ?? null,
      }));
    },
    enabled: !!spaceId,
    staleTime: 60 * 1000,
  });

  const purchase = useMutation({
    mutationFn: async () => {
      return callPurchaseSpace({ spaceId: spaceId! });
    },
    onSuccess: () => {
      setPurchaseSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["store-spaces"] });
      useConsumerStore.getState().markPurchased([spaceId!]);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border overflow-hidden">
          <Skeleton className="h-56 w-full" />
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !space) {
    return (
      <div className="space-y-4">
        <Link to="/store" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Store
        </Link>
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          Space not found or failed to load.
        </div>
      </div>
    );
  }

  const price = space.price ?? 0;
  const currency = space.currency ?? "USD";
  const labels: string[] = space.labels ?? [];

  return (
    <div className="space-y-6">
      <Link to="/store" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to Store
      </Link>

      {/* Hero */}
      <div className="overflow-hidden rounded-lg border bg-card">
        {space.storeThumbnailUrl || space.thumbnailUrl ? (
          <img
            src={space.storeThumbnailUrl || space.thumbnailUrl}
            alt={space.title}
            loading="eager"
            decoding="async"
            className="h-56 w-full object-cover"
          />
        ) : (
          <div className="flex h-56 items-center justify-center bg-muted">
            <BookOpen className="h-16 w-16 text-muted-foreground" />
          </div>
        )}

        <div className="p-6 space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{space.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {space.subject && (
                <span className="inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
                  {space.subject}
                </span>
              )}
              {labels.map((label: string) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-0.5 rounded-full bg-muted px-2.5 py-0.5 text-xs"
                >
                  <Tag className="h-2.5 w-2.5" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <p className="text-muted-foreground">
            {space.storeDescription || space.description || "No description available."}
          </p>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {space.stats?.totalStoryPoints ?? storyPoints?.length ?? 0} lessons
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {space.stats?.totalStudents ?? 0} enrolled
            </span>
            {space.type && (
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                {space.type}
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4 pt-2">
            <span className="text-2xl font-bold">
              {price === 0 ? "Free" : `${currency} ${price}`}
            </span>

            {enrolled || purchaseSuccess ? (
              <Button
                onClick={() => navigate(`/spaces/${spaceId}`)}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                Continue Learning
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => purchase.mutate()}
                  disabled={purchase.isPending}
                >
                  {purchase.isPending
                    ? "Enrolling..."
                    : price === 0
                      ? "Enroll Free"
                      : "Enroll Now"}
                </Button>
                {!inCart && price > 0 && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      addToCart({
                        spaceId: spaceId!,
                        title: space.title,
                        price,
                        currency,
                        thumbnailUrl: space.storeThumbnailUrl || space.thumbnailUrl || null,
                      })
                    }
                    className="gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                )}
                {inCart && (
                  <Button
                    variant="outline"
                    onClick={() => removeFromCart(spaceId!)}
                    className="gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Remove from Cart
                  </Button>
                )}
              </div>
            )}
          </div>

          {purchase.isError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {(purchase.error as Error)?.message || "Failed to enroll. Please try again."}
            </div>
          )}

          {purchaseSuccess && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
              Successfully enrolled! You can now access this space.
            </div>
          )}
        </div>
      </div>

      {/* Content Preview */}
      {storyPoints && storyPoints.length > 0 && (
        <div className="rounded-lg border bg-card">
          <div className="flex items-center gap-2 border-b px-6 py-4">
            <ListOrdered className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold">
              Course Content ({storyPoints.length} lessons)
            </h2>
          </div>
          <div className="divide-y">
            {storyPoints.map((sp, index) => (
              <div
                key={sp.id}
                className="flex items-center gap-3 px-6 py-3"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{sp.title}</p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {sp.type}
                  </p>
                </div>
                {sp.estimatedMinutes && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {sp.estimatedMinutes} min
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
