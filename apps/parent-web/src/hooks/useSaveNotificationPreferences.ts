import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import { getFirebaseServices } from "@levelup/shared-services";
import type { NotificationPreferences } from "./useNotificationPreferences";

export function useSaveNotificationPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tenantId,
      userId,
      prefs,
    }: {
      tenantId: string;
      userId: string;
      prefs: NotificationPreferences;
    }) => {
      const { db } = getFirebaseServices();
      const ref = doc(db, `tenants/${tenantId}/notificationPreferences`, userId);
      await setDoc(ref, prefs, { merge: true });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "tenants",
          variables.tenantId,
          "notificationPreferences",
          variables.userId,
        ],
      });
    },
  });
}
