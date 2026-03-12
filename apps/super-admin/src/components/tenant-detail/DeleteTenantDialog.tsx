import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callDeactivateTenant } from "@levelup/shared-services";
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
  Input,
  Label,
} from "@levelup/shared-ui";
import { AlertTriangle } from "lucide-react";

interface Props {
  tenant: Tenant;
  tenantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTenantDialog({ tenant, tenantId, open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { handleError } = useApiError();
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const deactivateTenant = useMutation({
    mutationFn: async () => {
      await callDeactivateTenant({ tenantId, reason: "Deactivated via super-admin panel" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform", "tenants"] });
      toast.success("Tenant deactivated successfully");
      navigate("/tenants", { replace: true });
    },
    onError: (err: unknown) => handleError(err, "Failed to deactivate tenant"),
  });

  return (
    <AlertDialog open={open} onOpenChange={(o) => { if (!o) { setDeleteConfirmText(""); onOpenChange(false); } }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Deactivate Tenant
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will deactivate &ldquo;{tenant.name}&rdquo; and suspend all associated memberships
            including {tenant.stats?.totalStudents ?? 0} students and{" "}
            {tenant.stats?.totalTeachers ?? 0} teachers. The tenant can be reactivated later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2 py-2">
          <Label>Type <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded">{tenant.tenantCode}</code> to confirm</Label>
          <Input value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} placeholder={tenant.tenantCode} />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deactivateTenant.isPending}>Cancel</AlertDialogCancel>
          <Button variant="destructive" disabled={deactivateTenant.isPending || deleteConfirmText !== tenant.tenantCode} onClick={() => deactivateTenant.mutate()}>
            {deactivateTenant.isPending ? "Deactivating..." : "I understand, deactivate this tenant"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
