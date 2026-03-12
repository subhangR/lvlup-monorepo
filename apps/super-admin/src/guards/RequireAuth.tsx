import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@levelup/shared-stores";
import { LogoutButton, Button } from "@levelup/shared-ui";

export default function RequireAuth() {
  const { firebaseUser, user, loading, logout } = useAuthStore();
  const location = useLocation();
  const [claimsVerified, setClaimsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    if (!firebaseUser) {
      setClaimsVerified(null);
      return;
    }

    let cancelled = false;
    firebaseUser.getIdTokenResult().then((result) => {
      if (!cancelled) {
        setClaimsVerified(result.claims.role === "superAdmin");
      }
    }).catch(() => {
      if (!cancelled) setClaimsVerified(false);
    });

    return () => { cancelled = true; };
  }, [firebaseUser]);

  if (loading || (firebaseUser && claimsVerified === null)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!firebaseUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Fix C1: Block access when user doc is missing OR user is not super admin
  // Fix C2: Also verify Firebase custom claims for defense-in-depth
  if (!user || !user.isSuperAdmin || !claimsVerified) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Access Denied</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Super admin privileges required.
          </p>
          <LogoutButton
            onLogout={logout}
            className="mt-4 inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium hover:bg-accent transition-colors"
          >
            Sign Out
          </LogoutButton>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
