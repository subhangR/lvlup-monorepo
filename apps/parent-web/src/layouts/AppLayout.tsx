import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@levelup/shared-stores";
import {
  AppShell,
  AppSidebar,
  RoleSwitcher,
  NotificationBell,
  SkipToContent,
  ThemeToggle,
  PageTransition,
  RouteAnnouncer,
  MobileBottomNav,
  SWUpdateNotification,
  PWAInstallBanner,
  OfflineBanner,
  type NavGroup,
  type TenantOption,
  type MobileNavItem,
} from "@levelup/shared-ui";
import { useNotifications, useUnreadCount, useMarkRead, useMarkAllRead, useTenantBranding, usePrefetch } from "@levelup/shared-hooks";

/** Route prefetch map — triggers lazy imports on link hover */
const PARENT_PREFETCH_MAP: Record<string, () => Promise<unknown>> = {
  '/': () => import('../pages/DashboardPage'),
  '/children': () => import('../pages/ChildrenPage'),
  '/results': () => import('../pages/ExamResultsPage'),
  '/progress': () => import('../pages/SpaceProgressPage'),
  '/child-progress': () => import('../pages/ChildProgressPage'),
  '/alerts': () => import('../pages/PerformanceAlertsPage'),
  '/compare': () => import('../pages/ChildComparisonPage'),
  '/notifications': () => import('../pages/NotificationsPage'),
  '/settings': () => import('../pages/SettingsPage'),
};
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Settings,
  Bell,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import { useTenantNames } from "../hooks/useTenantNames";

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { allMemberships, currentTenantId, switchTenant, user, firebaseUser } =
    useAuthStore();

  const parentTenantIds = allMemberships
    .filter((m) => m.role === "parent")
    .map((m) => m.tenantId);
  const { data: tenantNames } = useTenantNames(parentTenantIds);

  // Apply tenant branding (colors + CSS custom properties)
  useTenantBranding();

  // Prefetch routes on link hover for near-instant navigation
  usePrefetch(PARENT_PREFETCH_MAP);

  const { data: notifData, isLoading: notifsLoading } = useNotifications(
    currentTenantId,
    firebaseUser?.uid ?? null,
  );
  const unreadCount = useUnreadCount(currentTenantId, firebaseUser?.uid ?? null);
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const navGroups: NavGroup[] = [
    {
      label: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
          isActive: location.pathname === "/",
        },
      ],
    },
    {
      label: "My Children",
      items: [
        {
          title: "Children",
          url: "/children",
          icon: Users,
          isActive: location.pathname.startsWith("/children"),
        },
        {
          title: "Exam Results",
          url: "/results",
          icon: ClipboardList,
          isActive: location.pathname.startsWith("/results"),
        },
        {
          title: "Space Progress",
          url: "/progress",
          icon: BookOpen,
          isActive: location.pathname.startsWith("/progress"),
        },
        {
          title: "Child Progress",
          url: "/child-progress",
          icon: TrendingUp,
          isActive: location.pathname.startsWith("/child-progress"),
        },
        {
          title: "Alerts",
          url: "/alerts",
          icon: AlertTriangle,
          isActive: location.pathname.startsWith("/alerts"),
        },
        {
          title: "Compare Children",
          url: "/compare",
          icon: BarChart3,
          isActive: location.pathname === "/compare",
        },
      ],
    },
    {
      label: "Account",
      items: [
        {
          title: "Notifications",
          url: "/notifications",
          icon: Bell,
          isActive: location.pathname.startsWith("/notifications"),
          badge: unreadCount > 0 ? unreadCount : undefined,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
          isActive: location.pathname.startsWith("/settings"),
        },
      ],
    },
  ];

  const tenantOptions: TenantOption[] = allMemberships
    .filter((m) => m.role === "parent")
    .map((m) => ({
      tenantId: m.tenantId,
      tenantName: tenantNames?.[m.tenantId] ?? m.tenantCode ?? m.tenantId,
      role: m.role,
    }));

  const sidebarFooter = (
    <div className="space-y-2">
      <RoleSwitcher
        currentTenantId={currentTenantId}
        tenants={tenantOptions}
        onSwitch={switchTenant}
      />
      <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
        <span className="truncate">{user?.displayName ?? user?.email}</span>
      </div>
    </div>
  );

  const sidebar = (
    <AppSidebar
      appName="Parent"
      navGroups={navGroups}
      footerContent={sidebarFooter}
      pathname={location.pathname}
      LinkComponent={Link}
    />
  );

  const headerRight = (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <NotificationBell
        notifications={notifData?.notifications ?? []}
        unreadCount={unreadCount}
        isLoading={notifsLoading}
        onNotificationClick={(notif) => {
          if (!notif.isRead && currentTenantId) {
            markRead.mutate({ tenantId: currentTenantId, notificationId: notif.id });
          }
          if (notif.actionUrl) navigate(notif.actionUrl);
        }}
        onMarkAllRead={() => {
          if (currentTenantId) markAllRead.mutate({ tenantId: currentTenantId });
        }}
        onViewAll={() => navigate("/notifications")}
      />
    </div>
  );

  const mobileNavItems: MobileNavItem[] = [
    { icon: LayoutDashboard, label: "Home", to: "/", isActive: location.pathname === "/" },
    { icon: Users, label: "Children", to: "/children", isActive: location.pathname.startsWith("/children") },
    { icon: ClipboardList, label: "Results", to: "/results", isActive: location.pathname.startsWith("/results") },
    { icon: Bell, label: "Alerts", to: "/notifications", badge: unreadCount > 0 ? unreadCount : undefined, isActive: location.pathname.startsWith("/notifications") },
  ];

  return (
    <>
      <OfflineBanner />
      <SkipToContent />
      <AppShell sidebar={sidebar} headerRight={headerRight} hasBottomNav>
        <RouteAnnouncer pathname={location.pathname} />
        <div id="main-content">
          <PageTransition pageKey={location.pathname}>
            <Outlet />
          </PageTransition>
        </div>
      </AppShell>
      <MobileBottomNav items={mobileNavItems} LinkComponent={Link} />
      <SWUpdateNotification />
      <PWAInstallBanner />
    </>
  );
}
