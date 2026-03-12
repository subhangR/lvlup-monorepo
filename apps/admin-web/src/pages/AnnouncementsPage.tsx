import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentTenantId } from "@levelup/shared-stores";
import { useClasses } from "@levelup/shared-hooks/queries";
import { callSaveAnnouncement, callListAnnouncements } from "@levelup/shared-services/auth";
import type { SaveAnnouncementRequest, ListAnnouncementsResponse } from "@levelup/shared-types";
import {
  Button,
  Input,
  Label,
  Textarea,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  PageHeader,
  Skeleton,
  Checkbox,
  DataTablePagination,
} from "@levelup/shared-ui";
import { Plus, Megaphone, Archive, Send, Pencil, Info } from "lucide-react";
import { toast } from "sonner";
import { usePagination } from "../hooks/usePagination";

type AnnouncementStatus = "draft" | "published" | "archived";
type StatusTab = "all" | AnnouncementStatus;

type Announcement = ListAnnouncementsResponse["announcements"][number];

const AVAILABLE_ROLES = ["teacher", "student", "parent"] as const;

interface AnnouncementFormData {
  title: string;
  body: string;
  expiresAt: string;
  targetRoles: string[];
  targetClassIds: string[];
}

const emptyForm: AnnouncementFormData = {
  title: "",
  body: "",
  expiresAt: "",
  targetRoles: [],
  targetClassIds: [],
};

function formatTimestamp(ts: unknown): string {
  if (!ts) return "--";
  const record = ts as { seconds?: number };
  if (typeof record.seconds === "number") {
    return new Date(record.seconds * 1000).toLocaleDateString();
  }
  return "--";
}

function statusBadgeVariant(status: AnnouncementStatus) {
  switch (status) {
    case "draft":
      return "secondary" as const;
    case "published":
      return "default" as const;
    case "archived":
      return "outline" as const;
  }
}

export default function AnnouncementsPage() {
  const tenantId = useCurrentTenantId();
  const queryClient = useQueryClient();
  const { data: classes } = useClasses(tenantId);
  const [statusFilter, setStatusFilter] = useState<StatusTab>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AnnouncementFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  // Platform announcements (read-only)
  const { data: platformData, isLoading: platformLoading } = useQuery({
    queryKey: ["platform", "announcements", "published"],
    queryFn: () =>
      callListAnnouncements({ scope: "platform", status: "published" }),
    staleTime: 60_000,
  });

  // Tenant announcements
  const { data: tenantData, isLoading: tenantLoading } = useQuery({
    queryKey: ["tenant", tenantId, "announcements", statusFilter],
    queryFn: () =>
      callListAnnouncements({
        tenantId: tenantId ?? undefined,
        scope: "tenant",
        status: statusFilter === "all" ? undefined : statusFilter,
      }),
    enabled: !!tenantId,
    staleTime: 30_000,
  });

  const platformAnnouncements = useMemo(
    () => platformData?.announcements ?? [],
    [platformData],
  );

  const tenantAnnouncements = useMemo(
    () => tenantData?.announcements ?? [],
    [tenantData],
  );

  const { paginatedItems, currentPage, pageSize, totalItems, setCurrentPage, setPageSize } =
    usePagination(tenantAnnouncements, 20);

  const openCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (a: Announcement) => {
    setEditingId(a.id);
    setFormData({
      title: a.title,
      body: a.body,
      expiresAt: a.expiresAt
        ? new Date((a.expiresAt as { seconds: number }).seconds * 1000)
            .toISOString()
            .split("T")[0]
        : "",
      targetRoles: a.targetRoles ?? [],
      targetClassIds: a.targetClassIds ?? [],
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!tenantId) return;
    if (!formData.title.trim() || !formData.body.trim()) {
      toast.error("Title and body are required");
      return;
    }
    setSaving(true);
    try {
      const request: SaveAnnouncementRequest = editingId
        ? {
            id: editingId,
            tenantId,
            data: {
              title: formData.title.trim(),
              body: formData.body.trim(),
              targetRoles: formData.targetRoles.length
                ? formData.targetRoles
                : undefined,
              targetClassIds: formData.targetClassIds.length
                ? formData.targetClassIds
                : undefined,
              expiresAt: formData.expiresAt || undefined,
            },
          }
        : {
            tenantId,
            data: {
              title: formData.title.trim(),
              body: formData.body.trim(),
              scope: "tenant",
              status: "draft",
              targetRoles: formData.targetRoles.length
                ? formData.targetRoles
                : undefined,
              targetClassIds: formData.targetClassIds.length
                ? formData.targetClassIds
                : undefined,
              expiresAt: formData.expiresAt || undefined,
            },
          };
      await callSaveAnnouncement(request);
      queryClient.invalidateQueries({
        queryKey: ["tenant", tenantId, "announcements"],
      });
      setDialogOpen(false);
      setEditingId(null);
      setFormData(emptyForm);
      toast.success(editingId ? "Announcement updated" : "Announcement created");
    } catch (err) {
      toast.error("Failed to save announcement", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: AnnouncementStatus) => {
    if (!tenantId) return;
    try {
      await callSaveAnnouncement({ id, tenantId, data: { status: newStatus } });
      queryClient.invalidateQueries({
        queryKey: ["tenant", tenantId, "announcements"],
      });
      toast.success(
        newStatus === "published"
          ? "Announcement published"
          : "Announcement archived",
      );
    } catch (err) {
      toast.error("Failed to update status", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    }
  };

  const toggleRole = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter((r) => r !== role)
        : [...prev.targetRoles, role],
    }));
  };

  const toggleClassId = (classId: string) => {
    setFormData((prev) => ({
      ...prev,
      targetClassIds: prev.targetClassIds.includes(classId)
        ? prev.targetClassIds.filter((c) => c !== classId)
        : [...prev.targetClassIds, classId],
    }));
  };

  const statusTabs: StatusTab[] = ["all", "draft", "published", "archived"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description="Manage announcements for your organization"
        actions={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New Announcement
          </Button>
        }
      />

      {/* Platform Notices */}
      {(platformLoading || platformAnnouncements.length > 0) && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Info className="h-4 w-4" />
            Platform Notices
          </div>
          {platformLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-40" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="mt-1 h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {platformAnnouncements.map((a) => (
                <Card
                  key={a.id}
                  className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/30"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {a.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-3">
                      {a.body}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatTimestamp(a.createdAt)} &middot; {a.authorName}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tenant Announcements */}
      <Tabs
        value={statusFilter}
        onValueChange={(v) => setStatusFilter(v as StatusTab)}
      >
        <TabsList>
          {statusTabs.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="capitalize">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {statusTabs.map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[180px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenantLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-5 w-48" />
                          <Skeleton className="mt-1.5 h-3 w-64" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-16 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-32" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : !paginatedItems.length ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-48">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Megaphone className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <h3 className="mt-3 text-sm font-semibold">
                            No announcements found
                          </h3>
                          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                            {statusFilter !== "all"
                              ? "No announcements match this status filter."
                              : "Create your first announcement to get started."}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedItems.map((a) => (
                      <TableRow key={a.id} className="group">
                        <TableCell>
                          <div>
                            <p className="font-medium">{a.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {a.body}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusBadgeVariant(a.status)}>
                            {a.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {a.targetRoles?.length ? (
                              a.targetRoles.map((r) => (
                                <Badge
                                  key={r}
                                  variant="outline"
                                  className="text-xs capitalize"
                                >
                                  {r}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                Everyone
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{a.authorName}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm tabular-nums">
                            {formatTimestamp(a.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {a.status === "draft" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2"
                                  onClick={() => openEdit(a)}
                                >
                                  <Pencil className="mr-1 h-3 w-3" />
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-green-600 hover:text-green-700"
                                  onClick={() =>
                                    handleStatusChange(a.id, "published")
                                  }
                                >
                                  <Send className="mr-1 h-3 w-3" />
                                  Publish
                                </Button>
                              </>
                            )}
                            {a.status === "published" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-amber-600 hover:text-amber-700"
                                onClick={() =>
                                  handleStatusChange(a.id, "archived")
                                }
                              >
                                <Archive className="mr-1 h-3 w-3" />
                                Archive
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <DataTablePagination
                totalItems={totalItems}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Create / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(o) => {
          if (!o) {
            setDialogOpen(false);
            setEditingId(null);
            setFormData(emptyForm);
          }
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Announcement" : "New Announcement"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update the announcement details."
                : "Create a new announcement for your organization. It will be saved as a draft."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="ann-title">Title *</Label>
              <Input
                id="ann-title"
                placeholder="Announcement title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, title: e.target.value }))
                }
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ann-body">Body *</Label>
              <Textarea
                id="ann-body"
                placeholder="Write the announcement body..."
                value={formData.body}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, body: e.target.value }))
                }
                rows={5}
                maxLength={5000}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ann-expires">Expiry Date (optional)</Label>
              <Input
                id="ann-expires"
                type="date"
                value={formData.expiresAt}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, expiresAt: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Target Roles (optional)</Label>
              <p className="text-xs text-muted-foreground">
                Leave unchecked to send to everyone.
              </p>
              <div className="flex flex-wrap gap-4 pt-1">
                {AVAILABLE_ROLES.map((role) => (
                  <label
                    key={role}
                    className="flex items-center gap-2 text-sm capitalize cursor-pointer"
                  >
                    <Checkbox
                      checked={formData.targetRoles.includes(role)}
                      onCheckedChange={() => toggleRole(role)}
                    />
                    {role}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Target Classes (optional)</Label>
              <p className="text-xs text-muted-foreground">
                Leave unchecked to send to all classes.
              </p>
              <div className="max-h-40 overflow-y-auto rounded-md border p-2 space-y-1">
                {classes?.length ? (
                  classes.map((c) => (
                    <label
                      key={c.id}
                      className="flex items-center gap-2 text-sm cursor-pointer rounded px-1 py-0.5 hover:bg-muted"
                    >
                      <Checkbox
                        checked={formData.targetClassIds.includes(c.id)}
                        onCheckedChange={() => toggleClassId(c.id)}
                      />
                      {c.name}
                      {c.grade && (
                        <span className="text-xs text-muted-foreground">
                          Grade {c.grade}
                          {c.section ? ` - ${c.section}` : ""}
                        </span>
                      )}
                    </label>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground py-2 text-center">
                    No classes available
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setEditingId(null);
                setFormData(emptyForm);
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !formData.title.trim() || !formData.body.trim()}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update"
                  : "Create Draft"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
