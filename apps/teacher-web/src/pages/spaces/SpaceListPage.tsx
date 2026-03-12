import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentTenantId } from "@levelup/shared-stores";
import { useSpaces, useCreateSpace, useDuplicateSpace, useApiError } from "@levelup/shared-hooks";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { getFirebaseServices } from "@levelup/shared-services";
import {
  sonnerToast,
  Button,
  Input,
  StatusBadge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@levelup/shared-ui";
import {
  Plus,
  Search,
  BookOpen,
  Copy,
  Users,
  Loader2,
} from "lucide-react";
import type { Space, SpaceStatus, SpaceType, StoryPoint, UnifiedItem } from "@levelup/shared-types";

const STATUS_TABS: { label: string; value: SpaceStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

const SPACE_TEMPLATES: { value: string; label: string; type: SpaceType; description: string }[] = [
  { value: "blank", label: "Blank Space", type: "learning", description: "Start from scratch" },
  { value: "course", label: "Course", type: "learning", description: "Structured learning content" },
  { value: "assessment", label: "Assessment", type: "assessment", description: "Tests and quizzes" },
  { value: "practice", label: "Practice", type: "practice", description: "Practice problems" },
];

export default function SpaceListPage() {
  const tenantId = useCurrentTenantId();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SpaceStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("blank");
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const { handleError } = useApiError();

  const createSpace = useCreateSpace();
  const duplicateSpace = useDuplicateSpace();

  const statusFilter = activeTab === "all" ? undefined : activeTab;
  const { data: spaces = [], isLoading } = useSpaces(tenantId, {
    status: statusFilter,
  });

  const filtered = spaces.filter((s: Space) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateSpace = async () => {
    if (!tenantId) return;
    const template = SPACE_TEMPLATES.find((t) => t.value === selectedTemplate) ?? SPACE_TEMPLATES[0];
    try {
      const result = await createSpace.mutateAsync({
        tenantId,
        data: {
          title: template.value === "blank" ? "Untitled Space" : `New ${template.label}`,
          type: template.type,
        },
      });
      setShowCreateDialog(false);
      navigate(`/spaces/${result.id}/edit`);
    } catch (err) {
      handleError(err, "Failed to create space");
    }
  };

  const handleDuplicate = async (e: React.MouseEvent, space: Space) => {
    e.preventDefault();
    e.stopPropagation();
    if (!tenantId) return;
    setDuplicatingId(space.id);
    try {
      const { db } = getFirebaseServices();
      // Load story points
      const spCol = collection(db, `tenants/${tenantId}/spaces/${space.id}/storyPoints`);
      const spSnap = await getDocs(query(spCol, orderBy("orderIndex", "asc")));
      const storyPoints = spSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as StoryPoint);

      // Load items for each story point
      const itemsByStoryPoint: Record<string, UnifiedItem[]> = {};
      for (const sp of storyPoints) {
        const itemCol = collection(db, `tenants/${tenantId}/spaces/${space.id}/items`);
        const itemSnap = await getDocs(
          query(itemCol, where("storyPointId", "==", sp.id), orderBy("orderIndex", "asc"))
        );
        itemsByStoryPoint[sp.id] = itemSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as UnifiedItem);
      }

      const result = await duplicateSpace.mutateAsync({
        tenantId,
        sourceSpace: space,
        storyPoints,
        itemsByStoryPoint,
      });
      sonnerToast.success("Space duplicated successfully");
      navigate(`/spaces/${result.id}/edit`);
    } catch (err) {
      handleError(err, "Failed to duplicate space");
    } finally {
      setDuplicatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Spaces</h1>
          <p className="text-sm text-muted-foreground">
            Manage your learning spaces and content
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4" />
          New Space
        </Button>
      </div>

      {/* Create Space Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Space</DialogTitle>
            <DialogDescription>Choose a template to get started</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {SPACE_TEMPLATES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    <div>
                      <span className="font-medium">{t.label}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{t.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleCreateSpace}
              disabled={createSpace.isPending}
              className="w-full"
            >
              {createSpace.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Create Space
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search spaces..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex rounded-lg border p-0.5">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                activeTab === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Space Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-lg border bg-muted"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <BookOpen className="h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            {search ? "No spaces match your search" : "No spaces yet"}
          </p>
          {!search && (
            <Button onClick={() => setShowCreateDialog(true)} size="sm" className="mt-3">
              <Plus className="h-3 w-3" /> Create Space
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((space: Space) => (
            <Link
              key={space.id}
              to={`/spaces/${space.id}/edit`}
              className="group rounded-lg border bg-card p-5 hover:shadow-md transition-shadow"
            >
              {space.thumbnailUrl && (
                <img
                  src={space.thumbnailUrl}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="mb-3 h-32 w-full rounded-md object-cover"
                />
              )}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {space.title}
                  </h3>
                  {space.description && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {space.description}
                    </p>
                  )}
                </div>
                <StatusBadge status={space.status} />
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="capitalize">{space.type}</span>
                {space.subject && <span>{space.subject}</span>}
                <span>
                  {space.stats?.totalStoryPoints ?? 0} story points
                </span>
                <span>
                  {space.stats?.totalItems ?? 0} items
                </span>
                {(space.stats?.totalStudents ?? 0) > 0 && (
                  <span className="flex items-center gap-0.5">
                    <Users className="h-3 w-3" />
                    {space.stats?.totalStudents}
                  </span>
                )}
              </div>
              {space.labels && space.labels.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {space.labels.slice(0, 3).map((label) => (
                    <span
                      key={label}
                      className="rounded bg-muted px-1.5 py-0.5 text-[10px]"
                    >
                      {label}
                    </span>
                  ))}
                  {space.labels.length > 3 && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      +{space.labels.length - 3} more
                    </span>
                  )}
                </div>
              )}
              {/* Duplicate button */}
              <div className="mt-3 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDuplicate(e, space)}
                  disabled={duplicatingId === space.id}
                >
                  {duplicatingId === space.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  Duplicate
                </Button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
