import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiError } from "@levelup/shared-hooks";
import { sonnerToast as toast } from "@levelup/shared-ui";
import type { Tenant } from "@levelup/shared-types";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@levelup/shared-ui";
import { Power, PowerOff } from "lucide-react";
import { callDeactivateTenant, callReactivateTenant } from "@levelup/shared-services/auth";

interface Props {
  tenant: Tenant;
  tenantId: string;
}

export function TenantLifecycleCard({ tenant, tenantId }: Props) {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  const deactivate = useMutation({
    mutationFn: async () => callDeactivateTenant({ tenantId }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["platform", "tenant", tenantId] });
      queryClient.invalidateQueries({ queryKey: ["platform", "tenants"] });
      toast.success(`Tenant deactivated (${result?.membershipsSuspended ?? 0} memberships suspended)`);
    },
    onError: (err: unknown) => handleError(err, "Failed to deactivate tenant"),
  });

  const reactivate = useMutation({
    mutationFn: async () => callReactivateTenant({ tenantId }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["platform", "tenant", tenantId] });
      queryClient.invalidateQueries({ queryKey: ["platform", "tenants"] });
      toast.success(`Tenant reactivated (${result?.membershipsReactivated ?? 0} memberships restored)`);
    },
    onError: (err: unknown) => handleError(err, "Failed to reactivate tenant"),
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tenant Lifecycle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {tenant.status === "deactivated"
              ? "Reactivating will restore all suspended memberships."
              : "Deactivating will suspend all user memberships. Data is preserved."}
          </p>
          {tenant.status === "deactivated" ? (
            <Button variant="outline" onClick={() => reactivate.mutate()} disabled={reactivate.isPending} className="gap-2">
              <Power className="h-4 w-4" />
              {reactivate.isPending ? "Reactivating..." : "Reactivate Tenant"}
            </Button>
          ) : (
            <Button variant="destructive" onClick={() => setDeactivateOpen(true)} disabled={deactivate.isPending || tenant.status === "deactivated"} className="gap-2">
              <PowerOff className="h-4 w-4" />
              {deactivate.isPending ? "Deactivating..." : "Deactivate Tenant"}
            </Button>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Tenant?</AlertDialogTitle>
            <AlertDialogDescription>
              This will suspend all user memberships for <strong>{tenant.name}</strong>.
              Users will lose access until the tenant is reactivated. Data will be preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" disabled={deactivate.isPending} onClick={() => {
              deactivate.mutate(undefined, { onSuccess: () => setDeactivateOpen(false) });
            }}>
              {deactivate.isPending ? "Deactivating..." : "Confirm Deactivation"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
