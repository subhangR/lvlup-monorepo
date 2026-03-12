import { useState } from "react";
import { useCurrentTenantId } from "@levelup/shared-stores";
import {
  useSpaces,
  useClasses,
} from "@levelup/shared-hooks/queries";
import type { Space } from "@levelup/shared-types";
import {
  Badge,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@levelup/shared-ui";
import { Search, BookOpen, GraduationCap } from "lucide-react";
import { STATUS_VARIANT, TYPE_VARIANT } from "../lib/constants";

export default function CoursesPage() {
  const tenantId = useCurrentTenantId();
  const { data: spaces, isLoading: spacesLoading } = useSpaces(tenantId);
  const { data: classes = [] } = useClasses(tenantId);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = spaces?.filter((space: Space) => {
    if (statusFilter !== "all" && space.status !== statusFilter) return false;
    if (classFilter !== "all") {
      if (!space.classIds?.includes(classFilter)) return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      space.title.toLowerCase().includes(q) ||
      space.subject?.toLowerCase().includes(q) ||
      space.description?.toLowerCase().includes(q)
    );
  });

  // Group spaces by subject for overview
  const subjectGroups: Record<string, Space[]> = {};
  spaces?.forEach((space) => {
    const subject = space.subject || "Uncategorized";
    if (!subjectGroups[subject]) subjectGroups[subject] = [];
    subjectGroups[subject].push(space);
  });

  const getClassName = (classId: string) =>
    classes.find((c) => c.id === classId)?.name ?? classId.slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Courses & Spaces</h1>
        <p className="text-sm text-muted-foreground">
          View learning spaces assigned to classes and monitor progress
        </p>
      </div>

      {/* Subject Overview */}
      {Object.keys(subjectGroups).length > 0 && (
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          {Object.entries(subjectGroups)
            .sort((a, b) => b[1].length - a[1].length)
            .map(([subject, subjectSpaces]) => {
              const published = subjectSpaces.filter(
                (s) => s.status === "published",
              ).length;
              return (
                <div
                  key={subject}
                  className="rounded-lg border bg-card p-3"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium text-sm">{subject}</p>
                  </div>
                  <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                    <span>{subjectSpaces.length} total</span>
                    <span>{published} published</span>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Course Cards */}
      {spacesLoading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Loading courses...
        </div>
      ) : !filtered?.length ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <BookOpen className="h-10 w-10 mx-auto text-muted-foreground" />
          <h3 className="mt-3 text-lg font-semibold">No courses found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Teachers create learning spaces from the Teacher Portal
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((space) => (
            <div
              key={space.id}
              className="rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{space.title}</h3>
                    <Badge variant={STATUS_VARIANT[space.status] ?? "secondary"} className="capitalize">
                      {space.status}
                    </Badge>
                    <Badge variant={TYPE_VARIANT[space.type] ?? "secondary"} className="capitalize">
                      {space.type}
                    </Badge>
                  </div>
                  {space.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                      {space.description}
                    </p>
                  )}
                </div>
                {space.subject && (
                  <Badge variant="outline" className="ml-2">
                    {space.subject}
                  </Badge>
                )}
              </div>

              {/* Assigned Classes */}
              <div className="mt-3 flex items-center gap-2">
                <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Classes:</span>
                {space.classIds?.length ? (
                  <div className="flex flex-wrap gap-1">
                    {space.classIds.map((cId) => (
                      <Badge key={cId} variant="outline" className="text-xs">
                        {getClassName(cId)}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No classes assigned
                  </span>
                )}
              </div>

              {/* Metadata row */}
              <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                <span>{space.teacherIds?.length ?? 0} teacher(s)</span>
                {space.totalItems != null && (
                  <span>{space.totalItems} items</span>
                )}
                {space.createdBy && (
                  <span>
                    Created by: {space.createdBy.slice(0, 10)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
