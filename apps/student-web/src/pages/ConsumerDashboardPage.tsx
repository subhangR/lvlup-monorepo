import { Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore, useCurrentUser } from "@levelup/shared-stores";
import { getFirebaseServices } from "@levelup/shared-services";
import { BookOpen, ShoppingBag, User } from "lucide-react";
import { LogoutButton, Skeleton } from "@levelup/shared-ui";
import type { Space } from "@levelup/shared-types";

const PLATFORM_PUBLIC_TENANT_ID = "platform_public";

export default function ConsumerDashboardPage() {
  const { logout } = useAuthStore();
  const user = useCurrentUser();

  const enrolledIds = user?.consumerProfile?.enrolledSpaceIds ?? [];
  const plan = user?.consumerProfile?.plan ?? "free";

  // Fetch enrolled space details (batched to handle >30 items)
  const { data: enrolledSpaces, isLoading } = useQuery({
    queryKey: ["consumer-enrolled-spaces", enrolledIds],
    queryFn: async () => {
      if (enrolledIds.length === 0) return [];
      const { db: firestore } = getFirebaseServices();
      const spacesRef = collection(firestore, `tenants/${PLATFORM_PUBLIC_TENANT_ID}/spaces`);
      // Firestore 'in' supports up to 30 items — batch in chunks
      const results: Space[] = [];
      for (let i = 0; i < enrolledIds.length; i += 30) {
        const batch = enrolledIds.slice(i, i + 30);
        const q = query(spacesRef, where("__name__", "in", batch));
        const snap = await getDocs(q);
        results.push(...snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Space));
      }
      return results;
    },
    enabled: enrolledIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Learning</h1>
          <p className="text-sm text-muted-foreground">
            Welcome, {user?.displayName || user?.email || "Learner"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/profile"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm font-medium hover:bg-accent"
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
          <LogoutButton
            onLogout={logout}
            className="inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium hover:bg-accent"
          >
            Sign Out
          </LogoutButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Plan</p>
          <p className="text-lg font-semibold capitalize">{plan}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Enrolled Spaces</p>
          <p className="text-lg font-semibold">{enrolledIds.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Spend</p>
          <p className="text-lg font-semibold">
            ${user?.consumerProfile?.totalSpend?.toFixed(2) ?? "0.00"}
          </p>
        </div>
      </div>

      {/* Enrolled Spaces */}
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="font-semibold">My Enrolled Spaces</h2>
          <Link
            to="/store"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Browse Store
          </Link>
        </div>

        {isLoading && (
          <div className="p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          </div>
        )}

        {!isLoading && enrolledIds.length === 0 && (
          <div className="px-6 py-8 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              You haven't enrolled in any spaces yet.
            </p>
            <Link
              to="/store"
              className="mt-3 inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Explore the Store
            </Link>
          </div>
        )}

        {!isLoading && (enrolledSpaces ?? []).length > 0 && (
          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {(enrolledSpaces ?? []).map((space) => (
              <Link
                key={space.id}
                to={`/consumer/spaces/${space.id}`}
                className="group rounded-lg border transition-shadow hover:shadow-md"
              >
                {space.storeThumbnailUrl || space.thumbnailUrl ? (
                  <img
                    src={space.storeThumbnailUrl || space.thumbnailUrl}
                    alt={space.title}
                    loading="lazy"
                    decoding="async"
                    className="h-32 w-full rounded-t-lg object-cover"
                  />
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-t-lg bg-muted">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="p-3">
                  <h3 className="text-sm font-semibold group-hover:text-primary">
                    {space.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {space.stats?.totalStoryPoints ?? 0} lessons
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
