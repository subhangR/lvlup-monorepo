import { useState } from "react";
import { useCurrentTenantId } from "@levelup/shared-stores";
import { useSpaces } from "@levelup/shared-hooks";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query } from "firebase/firestore";
import { getFirebaseServices } from "@levelup/shared-services";
import { BookOpen, Users, BarChart3 } from "lucide-react";
import {
  ScoreCard,
  ProgressRing,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@levelup/shared-ui";
import type { Space } from "@levelup/shared-types";

interface SpaceAnalytics {
  totalStudents: number;
  completedStudents: number;
  avgCompletion: number;
  avgEngagementMinutes: number;
}

function useSpaceAnalytics(tenantId: string | null, spaceId: string | null) {
  return useQuery<SpaceAnalytics | null>({
    queryKey: ["tenants", tenantId, "spaces", spaceId, "analytics"],
    queryFn: async () => {
      if (!tenantId || !spaceId) return null;
      const { db } = getFirebaseServices();
      const colRef = collection(db, `tenants/${tenantId}/spaces/${spaceId}/progress`);
      const snap = await getDocs(query(colRef));
      if (snap.empty) return null;

      const progresses = snap.docs.map((d) => d.data());
      const totalStudents = progresses.length;
      const completedStudents = progresses.filter((p) => p.completionPercentage >= 100).length;
      const avgCompletion =
        progresses.reduce((sum, p) => sum + (p.completionPercentage ?? 0), 0) / totalStudents;
      const avgEngagementMinutes =
        progresses.reduce((sum, p) => sum + (p.totalTimeMinutes ?? 0), 0) / totalStudents;

      return {
        totalStudents,
        completedStudents,
        avgCompletion,
        avgEngagementMinutes,
      };
    },
    enabled: !!tenantId && !!spaceId,
    staleTime: 5 * 60 * 1000,
  });
}

export default function SpaceAnalyticsPage() {
  const tenantId = useCurrentTenantId();
  const { data: spaces = [] } = useSpaces(tenantId, { status: "published" });
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);

  const activeSpaceId = selectedSpaceId || spaces[0]?.id || null;
  const activeSpace = spaces.find((s: Space) => s.id === activeSpaceId);
  const { data: analytics, isLoading } = useSpaceAnalytics(tenantId, activeSpaceId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Space Analytics</h1>
          <p className="text-muted-foreground text-sm">
            Completion rates and engagement metrics per space
          </p>
        </div>
        <Select
          value={activeSpaceId ?? "__none__"}
          onValueChange={(v) => setSelectedSpaceId(v === "__none__" ? null : v)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select space" />
          </SelectTrigger>
          <SelectContent>
            {spaces.length === 0 && (
              <SelectItem value="__none__" disabled>
                No published spaces
              </SelectItem>
            )}
            {spaces.map((s: Space) => (
              <SelectItem key={s.id} value={s.id}>
                {s.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted h-24 animate-pulse rounded-lg border" />
          ))}
        </div>
      ) : !analytics ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <BarChart3 className="text-muted-foreground mx-auto h-10 w-10" />
          <p className="text-muted-foreground mt-3 text-sm">
            {spaces.length === 0
              ? "No published spaces yet. Publish a space to see analytics."
              : "No student progress data yet. Data will appear as students use this space."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <ScoreCard label="Total Students" value={analytics.totalStudents} icon={Users} />
            <ScoreCard label="Completed" value={analytics.completedStudents} icon={Users} />
            <ScoreCard
              label="Avg Completion"
              value={`${Math.round(analytics.avgCompletion)}%`}
              icon={BookOpen}
            />
            <ScoreCard
              label="Avg Engagement"
              value={`${Math.round(analytics.avgEngagementMinutes)} min`}
              icon={BarChart3}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="bg-card space-y-4 rounded-lg border p-5">
              <h2 className="font-semibold">Completion Overview</h2>
              <div className="flex items-center gap-6">
                <ProgressRing value={analytics.avgCompletion} label="Avg Completion" />
                <div className="space-y-2 text-sm">
                  <p>
                    Space: <span className="font-medium">{activeSpace?.title}</span>
                  </p>
                  <p>
                    Type: <span className="font-medium capitalize">{activeSpace?.type}</span>
                  </p>
                  {activeSpace?.subject && (
                    <p>
                      Subject: <span className="font-medium">{activeSpace.subject}</span>
                    </p>
                  )}
                  <p>
                    Story Points:{" "}
                    <span className="font-medium">{activeSpace?.stats?.totalStoryPoints ?? 0}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card space-y-4 rounded-lg border p-5">
              <h2 className="font-semibold">Engagement Metrics</h2>
              <div className="flex items-center gap-6">
                <ProgressRing
                  value={Math.min(
                    (analytics.completedStudents / analytics.totalStudents) * 100,
                    100
                  )}
                  label="Completion Rate"
                />
                <div className="space-y-2 text-sm">
                  <p>
                    Students Started: <span className="font-medium">{analytics.totalStudents}</span>
                  </p>
                  <p>
                    Students Completed:{" "}
                    <span className="font-medium">{analytics.completedStudents}</span>
                  </p>
                  <p>
                    Avg Time Spent:{" "}
                    <span className="font-medium">
                      {Math.round(analytics.avgEngagementMinutes)} min
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
