import { useAuthStore, useCurrentUser } from "@levelup/shared-stores";
import { Link } from "react-router-dom";
import { User, CreditCard, School } from "lucide-react";
import { LogoutButton } from "@levelup/shared-ui";

export default function ConsumerProfilePage() {
  const { logout } = useAuthStore();
  const user = useCurrentUser();

  const profile = user?.consumerProfile;
  const purchases = profile?.purchaseHistory ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <LogoutButton
          onLogout={logout}
          className="inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium hover:bg-accent"
        >
          Sign Out
        </LogoutButton>
      </div>

      {/* Account Info */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold">{user?.displayName || "Learner"}</p>
            <p className="text-sm text-muted-foreground">{user?.email || "--"}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Plan</p>
            <p className="text-sm font-medium capitalize">{profile?.plan ?? "free"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Enrolled Spaces</p>
            <p className="text-sm font-medium">{profile?.enrolledSpaceIds?.length ?? 0}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Spent</p>
            <p className="text-sm font-medium">
              {profile?.totalSpend ? `$${profile.totalSpend.toFixed(2)}` : "$0.00"}
            </p>
          </div>
        </div>
      </div>

      {/* Join a School CTA */}
      <div className="rounded-lg border border-dashed bg-card p-6">
        <div className="flex items-start gap-3">
          <School className="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div>
            <h2 className="font-semibold">Join a School</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Have a school code? Link your account to access school-specific
              content while keeping your personal learning progress.
            </p>
            <Link
              to="/login"
              className="mt-3 inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium hover:bg-accent"
            >
              Enter School Code
            </Link>
          </div>
        </div>
      </div>

      {/* Purchase History */}
      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-2 border-b px-6 py-4">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold">Purchase History</h2>
        </div>

        {purchases.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-muted-foreground">
            No purchases yet.{" "}
            <Link to="/store" className="text-primary hover:underline">
              Browse the store
            </Link>{" "}
            to find spaces.
          </div>
        ) : (
          <div className="divide-y">
            {purchases.map((p, i) => (
              <div
                key={p.transactionId || i}
                className="flex items-center justify-between px-6 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{p.spaceTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.purchasedAt && "toDate" in p.purchasedAt
                      ? p.purchasedAt.toDate().toLocaleDateString()
                      : "--"}
                  </p>
                </div>
                <span className="text-sm font-medium">
                  {p.amount === 0
                    ? "Free"
                    : `${p.currency} ${p.amount}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
