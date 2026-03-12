import { useState, useRef, useCallback } from "react";
import { useCurrentUser, useCurrentTenantId } from "@levelup/shared-stores";
import {
  useStudentProgressSummary,
  useStudentAchievements,
  useStudentLevel,
} from "@levelup/shared-hooks";
import {
  LevelBadge,
  StreakWidget,
  Card,
  CardContent,
  Skeleton,
  FadeIn,
  Button,
} from "@levelup/shared-ui";
import { sonnerToast as toast } from "@levelup/shared-ui";
import { User, Award, Star, School, Camera, IdCard } from "lucide-react";
import { useTenantStore, useAuthStore } from "@levelup/shared-stores";
import { callUploadTenantAsset } from "@levelup/shared-services/auth";
import { getFirebaseServices } from "@levelup/shared-services";
import { updateProfile } from "firebase/auth";

function ProfileSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading profile">
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      <Skeleton className="h-20 rounded-lg" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function StudentIDCard({
  displayName,
  email,
  photoURL,
  tenantName,
  tenantCode,
  level,
  tier,
}: {
  displayName: string;
  email: string;
  photoURL?: string | null;
  tenantName?: string;
  tenantCode?: string;
  level?: number;
  tier?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10 p-6 shadow-md">
      <div className="absolute top-0 right-0 h-24 w-24 -translate-y-4 translate-x-4 rounded-full bg-primary/5" />
      <div className="flex items-center gap-2 mb-4">
        <IdCard className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
          {tenantName ?? "LvlUp"} Student ID
        </h3>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary border-2 border-primary/20 flex-shrink-0">
          {photoURL ? (
            <img
              src={photoURL}
              alt=""
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold">{getInitials(displayName)}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-lg font-bold truncate">{displayName}</p>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
          {tenantCode && (
            <p className="text-xs font-mono text-muted-foreground mt-1">
              Code: {tenantCode}
            </p>
          )}
        </div>
      </div>
      {(level || tier) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {level && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
              Level {level}
            </span>
          )}
          {tier && (
            <span className="rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 font-medium text-amber-700 dark:text-amber-400 capitalize">
              {tier}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const user = useCurrentUser();
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const currentMembership = useAuthStore((s) => s.currentMembership);
  const tenantId = useCurrentTenantId();
  const tenantName = useTenantStore((s) => s.tenant?.name);

  const { data: summary, isLoading: summaryLoading } = useStudentProgressSummary(
    tenantId,
    user?.uid ?? null,
  );
  const { data: achievements, isLoading: achievementsLoading } = useStudentAchievements(
    tenantId,
    user?.uid ?? null,
  );
  const { data: levelData, isLoading: levelLoading } = useStudentLevel(
    tenantId,
    user?.uid ?? null,
  );

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
      toast.error("Please select an image under 2MB");
      return;
    }
    if (!tenantId || !firebaseUser) return;

    setUploading(true);
    try {
      const { uploadUrl, publicUrl } = await callUploadTenantAsset({
        tenantId,
        assetType: "profile_photo",
        contentType: file.type,
      });
      const xhr = new XMLHttpRequest();
      await new Promise<void>((resolve, reject) => {
        xhr.addEventListener("load", () =>
          xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Upload failed"))
        );
        xhr.addEventListener("error", () => reject(new Error("Upload failed")));
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      await updateProfile(firebaseUser, { photoURL: publicUrl });
      toast.success("Profile photo updated");
      // Force a re-render by reloading auth state
      window.location.reload();
    } catch (err) {
      toast.error("Failed to upload photo", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    } finally {
      setUploading(false);
    }
  }, [tenantId, firebaseUser]);

  const isLoading = summaryLoading || achievementsLoading || levelLoading;
  const displayName = user?.displayName ?? user?.email ?? "Student";

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Header */}
      <FadeIn>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary overflow-hidden"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  loading="eager"
                  decoding="async"
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold">{getInitials(displayName)}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="h-5 w-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePhotoUpload(file);
              }}
              className="hidden"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{displayName}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            {uploading && (
              <p className="text-xs text-primary mt-1">Uploading photo...</p>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Student ID Card */}
      <FadeIn delay={0.05}>
        <StudentIDCard
          displayName={displayName}
          email={user?.email ?? ""}
          photoURL={user?.photoURL}
          tenantName={tenantName}
          tenantCode={currentMembership?.tenantCode}
          level={levelData?.level}
          tier={levelData?.tier}
        />
      </FadeIn>

      {/* Level Badge */}
      {levelData && (
        <FadeIn delay={0.1}>
          <LevelBadge
            level={levelData.level}
            currentXP={levelData.currentXP}
            xpToNextLevel={levelData.xpToNextLevel}
            tier={levelData.tier}
          />
        </FadeIn>
      )}

      {/* Streak Widget */}
      {summary && (
        <FadeIn delay={0.15}>
          <StreakWidget currentStreak={summary.levelup.streakDays} />
        </FadeIn>
      )}

      {/* Stats */}
      <FadeIn delay={0.2}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10" aria-hidden="true">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{achievements?.length ?? 0}</p>
                <p className="text-xs text-muted-foreground">Achievements Earned</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30" aria-hidden="true">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {summary?.levelup.totalPointsEarned ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">Total Points</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30" aria-hidden="true">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round((summary?.overallScore ?? 0) * 100)}%
                </p>
                <p className="text-xs text-muted-foreground">Overall Score</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* School Info */}
      {tenantName && (
        <FadeIn delay={0.25}>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted" aria-hidden="true">
                <School className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">{tenantName}</p>
                <p className="text-xs text-muted-foreground">School</p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </div>
  );
}
