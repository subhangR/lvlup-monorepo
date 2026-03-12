import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@levelup/shared-stores";
import { NotificationsPage as NotificationsPageUI } from "@levelup/shared-ui";
import { useNotifications, useMarkRead, useMarkAllRead } from "@levelup/shared-hooks";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { currentTenantId, firebaseUser } = useAuthStore();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const { data, isLoading } = useNotifications(
    currentTenantId,
    firebaseUser?.uid ?? null,
    { unreadOnly: filter === "unread", limit: 50 },
  );
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  return (
    <NotificationsPageUI
      notifications={data?.notifications ?? []}
      isLoading={isLoading}
      hasMore={data?.hasMore}
      filter={filter}
      onFilterChange={setFilter}
      onNotificationClick={(notif) => {
        if (!notif.isRead && currentTenantId) {
          markRead.mutate({ tenantId: currentTenantId, notificationId: notif.id });
        }
        if (notif.actionUrl) navigate(notif.actionUrl);
      }}
      onMarkRead={(id) => {
        if (currentTenantId) markRead.mutate({ tenantId: currentTenantId, notificationId: id });
      }}
      onMarkAllRead={() => {
        if (currentTenantId) markAllRead.mutate({ tenantId: currentTenantId });
      }}
    />
  );
}
