import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@levelup/shared-stores";
import { Skeleton } from "@levelup/shared-ui";
import type { TenantRole } from "@levelup/shared-types";

interface RequireAuthProps {
  allowedRoles?: TenantRole[];
}

export default function RequireAuth({ allowedRoles }: RequireAuthProps) {
  const { firebaseUser, currentMembership, currentTenantId, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen">
        {/* Sidebar skeleton */}
        <div className="hidden md:block w-64 border-r bg-sidebar p-4 space-y-4">
          <Skeleton className="h-8 w-32" />
          <div className="space-y-2 mt-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </div>
        {/* Content skeleton */}
        <div className="flex-1 p-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <div className="grid gap-4 grid-cols-3 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (
    allowedRoles &&
    (!currentMembership ||
      !allowedRoles.includes(currentMembership.role) ||
      currentMembership.tenantId !== currentTenantId)
  ) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Access Denied</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            You don&apos;t have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
