import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore, useTenantStore } from "@levelup/shared-stores";
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
  Button,
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  type NavGroup,
  type TenantOption,
  type MobileNavItem,
} from "@levelup/shared-ui";
import { useNotifications, useUnreadCount, useMarkRead, useMarkAllRead, useTenantBranding, usePrefetch } from "@levelup/shared-hooks";

/** Route prefetch map — triggers lazy imports on link hover */
const STUDENT_PREFETCH_MAP: Record<string, () => Promise<unknown>> = {
  '/': () => import('../pages/DashboardPage'),
  '/spaces': () => import('../pages/SpacesListPage'),
  '/tests': () => import('../pages/TestsPage'),
  '/leaderboard': () => import('../pages/LeaderboardPage'),
  '/profile': () => import('../pages/ProfilePage'),
  '/settings': () => import('../pages/SettingsPage'),
  '/notifications': () => import('../pages/NotificationsPage'),
};
// Theme managed by shared ThemeToggle component
import { getFirebaseServices } from "@levelup/shared-services";
import { doc, getDoc } from "firebase/firestore";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Trophy,
  Settings,
  UserCircle,
  LogOut,
} from "lucide-react";

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { allMemberships, currentTenantId, switchTenant, user, firebaseUser, logout } =
    useAuthStore();

  // Apply tenant branding (colors + CSS custom properties)
  useTenantBranding();

  // Prefetch routes on link hover for near-instant navigation
  usePrefetch(STUDENT_PREFETCH_MAP);

  const { data: notifData, isLoading: notifsLoading } = useNotifications(
    currentTenantId,
    firebaseUser?.uid ?? null,
  );
  const unreadCount = useUnreadCount(currentTenantId, firebaseUser?.uid ?? null);
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const navGroups: NavGroup[] = [
    {
      label: "",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
          isActive: location.pathname === "/",
        },
        {
          title: "My Spaces",
          url: "/spaces",
          icon: BookOpen,
          isActive: location.pathname.startsWith("/spaces"),
        },
        {
          title: "Tests",
          url: "/tests",
          icon: ClipboardList,
          isActive: location.pathname.startsWith("/tests"),
        },
        {
          title: "Leaderboard",
          url: "/leaderboard",
          icon: Trophy,
          isActive: location.pathname.startsWith("/leaderboard"),
        },
        {
          title: "Profile",
          url: "/profile",
          icon: UserCircle,
          isActive: location.pathname === "/profile",
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
          isActive: location.pathname === "/settings",
        },
      ],
    },
  ];

  const currentTenantName = useTenantStore((s) => s.tenant?.name);
  const [tenantNames, setTenantNames] = useState<Record<string, string>>({});

  const studentMemberships = allMemberships.filter((m) => m.role === "student");

  useEffect(() => {
    const otherTenantIds = studentMemberships
      .map((m) => m.tenantId)
      .filter((id) => id !== currentTenantId);
    if (otherTenantIds.length === 0) return;

    const { db } = getFirebaseServices();
    Promise.all(
      otherTenantIds.map(async (id) => {
        const snap = await getDoc(doc(db, "tenants", id));
        return [id, snap.exists() ? (snap.data() as { name?: string }).name ?? id : id] as const;
      }),
    ).then((entries) => {
      setTenantNames(Object.fromEntries(entries));
    });
  }, [studentMemberships.length, currentTenantId]);

  const tenantOptions: TenantOption[] = studentMemberships.map((m) => ({
    tenantId: m.tenantId,
    tenantName:
      m.tenantId === currentTenantId
        ? currentTenantName ?? m.tenantId
        : tenantNames[m.tenantId] ?? m.tenantId,
    role: m.role,
  }));

  const displayName = user?.displayName ?? user?.email ?? "Student";
  const initials = displayName
    .split(" ")
    .map((w: string) => w.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sidebarFooter = (
    <div className="space-y-2">
      <RoleSwitcher
        currentTenantId={currentTenantId}
        tenants={tenantOptions}
        onSwitch={switchTenant}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start gap-2 px-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <span className="truncate text-xs">{displayName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user?.displayName ?? "Student"}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/settings")}>
            <Settings className="mr-2 h-4 w-4" /> Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { logout(); navigate("/login"); }}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const sidebar = (
    <AppSidebar
      appName="Student"
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
    { icon: BookOpen, label: "Spaces", to: "/spaces", isActive: location.pathname.startsWith("/spaces") },
    { icon: ClipboardList, label: "Tests", to: "/tests", isActive: location.pathname.startsWith("/tests") },
    { icon: Trophy, label: "Rank", to: "/leaderboard", isActive: location.pathname.startsWith("/leaderboard") },
    { icon: UserCircle, label: "Profile", to: "/profile", isActive: location.pathname === "/profile" },
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
