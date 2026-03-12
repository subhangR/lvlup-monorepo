import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseServices } from "@levelup/shared-services";

export interface NotificationPreferences {
  emailNotifs: boolean;
  pushNotifs: boolean;
  examResults: boolean;
  achievementAlerts: boolean;
  leaderboardUpdates: boolean;
  streakReminders: boolean;
}

export const DEFAULT_PREFS: NotificationPreferences = {
  emailNotifs: true,
  pushNotifs: true,
  examResults: true,
  achievementAlerts: true,
  leaderboardUpdates: true,
  streakReminders: true,
};

export function useNotificationPreferences(tenantId: string | null, userId: string | null) {
  return useQuery<NotificationPreferences>({
    queryKey: ["tenants", tenantId, "notificationPreferences", userId],
    queryFn: async () => {
      if (!tenantId || !userId) return DEFAULT_PREFS;
      const { db } = getFirebaseServices();
      const ref = doc(db, `tenants/${tenantId}/notificationPreferences`, userId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return { ...DEFAULT_PREFS, ...snap.data() } as NotificationPreferences;
      }
      return DEFAULT_PREFS;
    },
    enabled: !!tenantId && !!userId,
    staleTime: 5 * 60 * 1000,
  });
}
