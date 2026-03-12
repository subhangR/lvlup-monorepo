import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { getFirebaseServices } from "@levelup/shared-services";
import type { StaffPermissions } from "@levelup/shared-types";
import { callSaveStaff } from "@levelup/shared-services/auth";
import {
  Button,
  Input,
  Label,
  Switch,
  Badge,
  Skeleton,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@levelup/shared-ui";
import { toast } from "sonner";
import { useApiError } from "@levelup/shared-hooks";
import { Search, UserCog, Plus, Shield } from "lucide-react";
import CreateStaffDialog from "./CreateStaffDialog";

interface StaffDoc {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  department?: string;
  status: string;
  uid?: string;
}

interface StaffMembershipDoc {
  id: string;
  uid: string;
  role: string;
  staffPermissions?: StaffPermissions;
}

const STAFF_PERMISSION_LABELS: Record<string, string> = {
  canManageUsers: "Manage Users",
  canManageClasses: "Manage Classes",
  canViewAnalytics: "View Analytics",
  canExportData: "Export Data",
  canManageSettings: "Manage Settings",
  canManageBilling: "Manage Billing",
};

function useStaffList(tenantId: string | null) {
  return useQuery<StaffDoc[]>({
    queryKey: ["tenants", tenantId, "staff"],
    queryFn: async () => {
      if (!tenantId) return [];
      const { db } = getFirebaseServices();
      const colRef = collection(db, `tenants/${tenantId}/staff`);
      const q = query(colRef, orderBy("name", "asc"));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as StaffDoc);
    },
    enabled: !!tenantId,
    staleTime: 60_000,
  });
}

function useStaffMemberships(tenantId: string | null) {
  return useQuery<StaffMembershipDoc[]>({
    queryKey: ["memberships", tenantId, "staff"],
    queryFn: async () => {
      if (!tenantId) return [];
      const { db } = getFirebaseServices();
      const colRef = collection(db, "userMemberships");
      const q = query(
        colRef,
        where("tenantId", "==", tenantId),
        where("role", "==", "staff"),
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as StaffMembershipDoc);
    },
    enabled: !!tenantId,
    staleTime: 60_000,
  });
}

interface StaffTabProps {
  tenantId: string | null;
}

export default function StaffTab({ tenantId }: StaffTabProps) {
  const { handleError } = useApiError();
  const queryClient = useQueryClient();
  const { data: staffList, isLoading } = useStaffList(tenantId);
  const { data: memberships } = useStaffMemberships(tenantId);

  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffDoc | null>(null);
  const [permissionForm, setPermissionForm] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  const filteredStaff = (staffList ?? []).filter((s) => {
    const name = s.name ?? `${s.firstName ?? ""} ${s.lastName ?? ""}`;
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );
  });

  const getMembershipForStaff = (staff: StaffDoc): StaffMembershipDoc | undefined => {
    if (!staff.uid) return undefined;
    return memberships?.find((m) => m.uid === staff.uid);
  };

  const openPermissionEditor = (staff: StaffDoc) => {
    const membership = getMembershipForStaff(staff);
    const perms = membership?.staffPermissions ?? {};
    setPermissionForm({
      canManageUsers: perms.canManageUsers ?? false,
      canManageClasses: perms.canManageClasses ?? false,
      canViewAnalytics: perms.canViewAnalytics ?? false,
      canExportData: perms.canExportData ?? false,
      canManageSettings: perms.canManageSettings ?? false,
      canManageBilling: perms.canManageBilling ?? false,
    });
    setEditingStaff(staff);
  };

  const handleSavePermissions = async () => {
    if (!tenantId || !editingStaff) return;
    setSaving(true);
    try {
      await callSaveStaff({
        id: editingStaff.id,
        tenantId,
        data: {
          staffPermissions: permissionForm as StaffPermissions,
        },
      });
      queryClient.invalidateQueries({ queryKey: ["memberships", tenantId, "staff"] });
      setEditingStaff(null);
      toast.success("Staff permissions updated");
    } catch (err) {
      handleError(err, "Failed to update permissions");
    } finally {
      setSaving(false);
    }
  };

  const enabledPermCount = (staff: StaffDoc): number => {
    const membership = getMembershipForStaff(staff);
    if (!membership?.staffPermissions) return 0;
    return Object.entries(membership.staffPermissions)
      .filter(([k, v]) => k.startsWith("can") && v === true)
      .length;
  };

  const handleCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["tenants", tenantId, "staff"] });
    queryClient.invalidateQueries({ queryKey: ["memberships", tenantId, "staff"] });
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search staff by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : filteredStaff.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <UserCog className="mx-auto h-8 w-8 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-semibold">No staff members</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add administrative staff members to help manage your school
          </p>
          <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Add Staff
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredStaff.map((staff) => {
            const name =
              staff.name ??
              `${staff.firstName ?? ""} ${staff.lastName ?? ""}`.trim();
            const permCount = enabledPermCount(staff);

            return (
              <div
                key={staff.id}
                className="flex items-center justify-between rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{name || "Unnamed"}</p>
                    <Badge
                      variant={
                        staff.status === "active" ? "default" : "secondary"
                      }
                    >
                      {staff.status}
                    </Badge>
                  </div>
                  <div className="mt-1 flex gap-4 text-sm text-muted-foreground">
                    {staff.email && <span>{staff.email}</span>}
                    {staff.department && <span>{staff.department}</span>}
                    <span>
                      {permCount}/{Object.keys(STAFF_PERMISSION_LABELS).length}{" "}
                      permissions
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openPermissionEditor(staff)}
                >
                  <Shield className="mr-1 h-4 w-4" />
                  Permissions
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Permission Editor Dialog */}
      <Dialog
        open={!!editingStaff}
        onOpenChange={(open) => !open && setEditingStaff(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit Permissions —{" "}
              {editingStaff?.name ??
                `${editingStaff?.firstName ?? ""} ${editingStaff?.lastName ?? ""}`.trim()}
            </DialogTitle>
            <DialogDescription>
              Toggle individual permissions for this staff member
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {Object.entries(STAFF_PERMISSION_LABELS).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={`staff-${key}`}>{label}</Label>
                <Switch
                  id={`staff-${key}`}
                  checked={permissionForm[key] ?? false}
                  onCheckedChange={(checked) =>
                    setPermissionForm((p) => ({ ...p, [key]: checked }))
                  }
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingStaff(null)}
            >
              Cancel
            </Button>
            <Button onClick={handleSavePermissions} disabled={saving}>
              {saving ? "Saving..." : "Save Permissions"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {tenantId && (
        <CreateStaffDialog
          tenantId={tenantId}
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onCreated={handleCreated}
        />
      )}
    </>
  );
}
