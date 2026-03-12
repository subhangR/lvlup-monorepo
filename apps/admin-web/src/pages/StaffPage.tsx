import { useState } from "react";
import { useCurrentTenantId } from "@levelup/shared-stores";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { getFirebaseServices } from "@levelup/shared-services";
import { callSaveTeacher } from "@levelup/shared-services/auth";
import type { TeacherPermissions } from "@levelup/shared-types";
import {
  Button,
  Input,
  Label,
  Switch,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Skeleton,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@levelup/shared-ui";
import { toast } from "sonner";
import { useApiError } from "@levelup/shared-hooks";
import { Shield, Search, UserCog } from "lucide-react";
import StaffTab from "../components/staff/StaffTab";

interface TeacherDoc {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  subjects?: string[];
  classIds?: string[];
  status: string;
  uid?: string;
}

interface MembershipDoc {
  id: string;
  uid: string;
  role: string;
  permissions?: TeacherPermissions;
}

const TEACHER_PERMISSION_LABELS: Record<string, string> = {
  canCreateExams: "Create Exams",
  canEditRubrics: "Edit Rubrics",
  canManuallyGrade: "Manually Grade",
  canViewAllExams: "View All Exams",
  canCreateSpaces: "Create Spaces",
  canManageContent: "Manage Content",
  canViewAnalytics: "View Analytics",
  canConfigureAgents: "Configure AI Agents",
};

function useTeachersList(tenantId: string | null) {
  return useQuery<TeacherDoc[]>({
    queryKey: ["tenants", tenantId, "teachers"],
    queryFn: async () => {
      if (!tenantId) return [];
      const { db } = getFirebaseServices();
      const colRef = collection(db, `tenants/${tenantId}/teachers`);
      const q = query(colRef, orderBy("name", "asc"));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TeacherDoc);
    },
    enabled: !!tenantId,
    staleTime: 60_000,
  });
}

function useMemberships(tenantId: string | null) {
  return useQuery<MembershipDoc[]>({
    queryKey: ["memberships", tenantId, "teachers"],
    queryFn: async () => {
      if (!tenantId) return [];
      const { db } = getFirebaseServices();
      const colRef = collection(db, "userMemberships");
      const q = query(
        colRef,
        where("tenantId", "==", tenantId),
        where("role", "==", "teacher"),
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as MembershipDoc);
    },
    enabled: !!tenantId,
    staleTime: 60_000,
  });
}

export default function StaffPage() {
  const tenantId = useCurrentTenantId();
  const { handleError } = useApiError();
  const queryClient = useQueryClient();
  const { data: teachers, isLoading } = useTeachersList(tenantId);
  const { data: memberships } = useMemberships(tenantId);

  const [activeTab, setActiveTab] = useState<"teachers" | "staff">("teachers");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTeacher, setEditingTeacher] = useState<TeacherDoc | null>(null);
  const [permissionForm, setPermissionForm] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  const filteredTeachers = (teachers ?? []).filter((t) => {
    const name = t.name ?? `${t.firstName ?? ""} ${t.lastName ?? ""}`;
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
  });

  const getMembershipForTeacher = (teacher: TeacherDoc): MembershipDoc | undefined => {
    if (!teacher.uid) return undefined;
    return memberships?.find((m) => m.uid === teacher.uid);
  };

  const openPermissionEditor = (teacher: TeacherDoc) => {
    const membership = getMembershipForTeacher(teacher);
    const perms = membership?.permissions ?? {};
    setPermissionForm({
      canCreateExams: perms.canCreateExams ?? true,
      canEditRubrics: perms.canEditRubrics ?? true,
      canManuallyGrade: perms.canManuallyGrade ?? true,
      canViewAllExams: perms.canViewAllExams ?? false,
      canCreateSpaces: perms.canCreateSpaces ?? false,
      canManageContent: perms.canManageContent ?? false,
      canViewAnalytics: perms.canViewAnalytics ?? false,
      canConfigureAgents: perms.canConfigureAgents ?? false,
    });
    setEditingTeacher(teacher);
  };

  const handleSavePermissions = async () => {
    if (!tenantId || !editingTeacher) return;
    setSaving(true);
    try {
      await callSaveTeacher({
        id: editingTeacher.id,
        tenantId,
        data: {
          permissions: permissionForm as TeacherPermissions,
        },
      });
      queryClient.invalidateQueries({ queryKey: ["memberships", tenantId] });
      setEditingTeacher(null);
      toast.success("Permissions updated");
    } catch (err) {
      handleError(err, "Failed to update permissions");
    } finally {
      setSaving(false);
    }
  };

  const enabledPermCount = (teacher: TeacherDoc): number => {
    const membership = getMembershipForTeacher(teacher);
    if (!membership?.permissions) return 0;
    return Object.entries(membership.permissions)
      .filter(([k, v]) => k.startsWith("can") && v === true)
      .length;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Staff & Permissions</h1>
        <p className="text-sm text-muted-foreground">
          Manage teacher permissions and staff roles
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "teachers" | "staff")}>
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="teachers" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <UserCog className="mx-auto h-8 w-8 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-semibold">No teachers found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Add teachers via the Users page to manage their permissions here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTeachers.map((teacher) => {
                const name = teacher.name ?? `${teacher.firstName ?? ""} ${teacher.lastName ?? ""}`.trim();
                const permCount = enabledPermCount(teacher);

                return (
                  <div
                    key={teacher.id}
                    className="flex items-center justify-between rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{name || "Unnamed"}</p>
                        <Badge variant={teacher.status === "active" ? "default" : "secondary"}>
                          {teacher.status}
                        </Badge>
                      </div>
                      <div className="mt-1 flex gap-4 text-sm text-muted-foreground">
                        {teacher.email && <span>{teacher.email}</span>}
                        {teacher.subjects && teacher.subjects.length > 0 && (
                          <span>{teacher.subjects.join(", ")}</span>
                        )}
                        <span>{permCount}/{Object.keys(TEACHER_PERMISSION_LABELS).length} permissions</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openPermissionEditor(teacher)}
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
          <Dialog open={!!editingTeacher} onOpenChange={(open) => !open && setEditingTeacher(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Edit Permissions — {editingTeacher?.name ??
                    `${editingTeacher?.firstName ?? ""} ${editingTeacher?.lastName ?? ""}`.trim()}
                </DialogTitle>
                <DialogDescription>
                  Toggle individual permissions for this teacher
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {Object.entries(TEACHER_PERMISSION_LABELS).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={key}>{label}</Label>
                    <Switch
                      id={key}
                      checked={permissionForm[key] ?? false}
                      onCheckedChange={(checked) =>
                        setPermissionForm((p) => ({ ...p, [key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingTeacher(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSavePermissions} disabled={saving}>
                  {saving ? "Saving..." : "Save Permissions"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <StaffTab tenantId={tenantId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
