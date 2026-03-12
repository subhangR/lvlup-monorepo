import { useState, useEffect, useRef, useCallback } from "react";
import type { Space, SpaceType, SpaceAccessType } from "@levelup/shared-types";
import { Save, ImageIcon, X, Link as LinkIcon } from "lucide-react";
import {
  Button,
  Input,
  Label,
  Textarea,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@levelup/shared-ui";
import { callUploadTenantAsset } from "@levelup/shared-services/auth";
import { sonnerToast as toast } from "@levelup/shared-ui";

const SPACE_TYPES: { value: SpaceType; label: string }[] = [
  { value: "learning", label: "Learning" },
  { value: "practice", label: "Practice" },
  { value: "assessment", label: "Assessment" },
  { value: "resource", label: "Resource" },
  { value: "hybrid", label: "Hybrid" },
];

const ACCESS_TYPES: { value: SpaceAccessType; label: string }[] = [
  { value: "class_assigned", label: "Class Assigned" },
  { value: "tenant_wide", label: "Tenant Wide" },
  { value: "public_store", label: "Public Store" },
];

const CURRENCIES = ["USD", "INR", "EUR", "GBP"];

const MAX_THUMB_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMG_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

interface Props {
  space: Space;
  onSave: (data: Partial<Space>) => Promise<void>;
  saving: boolean;
}

export default function SpaceSettingsPanel({ space, onSave, saving }: Props) {
  const [title, setTitle] = useState(space.title);
  const [description, setDescription] = useState(space.description ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(space.thumbnailUrl ?? "");
  const [thumbnailMode, setThumbnailMode] = useState<"upload" | "url">("upload");
  const [thumbUploading, setThumbUploading] = useState(false);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<SpaceType>(space.type);
  const [subject, setSubject] = useState(space.subject ?? "");
  const [labels, setLabels] = useState(space.labels?.join(", ") ?? "");
  const [accessType, setAccessType] = useState<SpaceAccessType>(space.accessType);
  const [allowRetakes, setAllowRetakes] = useState(space.allowRetakes ?? false);
  const [maxRetakes, setMaxRetakes] = useState(space.maxRetakes ?? 3);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(
    space.defaultTimeLimitMinutes ?? 0
  );
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(
    space.showCorrectAnswers ?? true
  );
  // Store listing fields
  const [publishedToStore, setPublishedToStore] = useState(space.publishedToStore ?? false);
  const [price, setPrice] = useState(space.price ?? 0);
  const [currency, setCurrency] = useState(space.currency ?? "USD");
  const [storeDescription, setStoreDescription] = useState(space.storeDescription ?? "");
  const [storeThumbnailUrl, setStoreThumbnailUrl] = useState(space.storeThumbnailUrl ?? "");

  useEffect(() => {
    setTitle(space.title);
    setDescription(space.description ?? "");
    setThumbnailUrl(space.thumbnailUrl ?? "");
    setType(space.type);
    setSubject(space.subject ?? "");
    setLabels(space.labels?.join(", ") ?? "");
    setAccessType(space.accessType);
    setAllowRetakes(space.allowRetakes ?? false);
    setMaxRetakes(space.maxRetakes ?? 3);
    setTimeLimitMinutes(space.defaultTimeLimitMinutes ?? 0);
    setShowCorrectAnswers(space.showCorrectAnswers ?? true);
    setPublishedToStore(space.publishedToStore ?? false);
    setPrice(space.price ?? 0);
    setCurrency(space.currency ?? "USD");
    setStoreDescription(space.storeDescription ?? "");
    setStoreThumbnailUrl(space.storeThumbnailUrl ?? "");
  }, [space]);

  const uploadThumbnail = useCallback(async (file: File) => {
    if (!ALLOWED_IMG_TYPES.has(file.type)) {
      toast.error("Only PNG, JPEG, and WebP images are allowed");
      return;
    }
    if (file.size > MAX_THUMB_SIZE) {
      toast.error("Image must be under 2MB");
      return;
    }
    setThumbUploading(true);
    try {
      const { uploadUrl, publicUrl } = await callUploadTenantAsset({
        tenantId: space.tenantId,
        assetType: "space_thumbnail",
        contentType: file.type,
      });
      const xhr = new XMLHttpRequest();
      await new Promise<void>((resolve, reject) => {
        xhr.addEventListener("load", () =>
          xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`))
        );
        xhr.addEventListener("error", () => reject(new Error("Upload failed")));
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
      setThumbnailUrl(publicUrl);
      toast.success("Thumbnail uploaded");
    } catch (err) {
      toast.error("Failed to upload thumbnail", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    } finally {
      setThumbUploading(false);
    }
  }, [space.tenantId]);

  const handleSave = () => {
    onSave({
      title,
      description: description || undefined,
      thumbnailUrl: thumbnailUrl || undefined,
      type,
      subject: subject || undefined,
      labels: labels
        ? labels.split(",").map((l) => l.trim()).filter(Boolean)
        : undefined,
      accessType,
      allowRetakes,
      maxRetakes: allowRetakes ? maxRetakes : undefined,
      defaultTimeLimitMinutes: timeLimitMinutes || undefined,
      showCorrectAnswers,
      // Store listing fields
      publishedToStore,
      price: publishedToStore ? price : undefined,
      currency: publishedToStore ? currency : undefined,
      storeDescription: publishedToStore ? storeDescription || undefined : undefined,
      storeThumbnailUrl: publishedToStore ? (storeThumbnailUrl || thumbnailUrl || undefined) : undefined,
    });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1"
          />
        </div>

        {/* Thumbnail */}
        <div>
          <Label>Thumbnail Image</Label>
          <div className="mt-1 flex items-center gap-2 mb-2">
            <Button
              type="button"
              variant={thumbnailMode === "upload" ? "default" : "outline"}
              size="sm"
              onClick={() => setThumbnailMode("upload")}
            >
              <ImageIcon className="h-3.5 w-3.5 mr-1" /> Upload
            </Button>
            <Button
              type="button"
              variant={thumbnailMode === "url" ? "default" : "outline"}
              size="sm"
              onClick={() => setThumbnailMode("url")}
            >
              <LinkIcon className="h-3.5 w-3.5 mr-1" /> URL
            </Button>
          </div>

          {thumbnailUrl && (
            <div className="relative inline-block mb-2">
              <img
                src={thumbnailUrl}
                alt="Thumbnail preview"
                className="h-24 w-40 rounded-lg border object-cover bg-muted"
              />
              <button
                type="button"
                onClick={() => setThumbnailUrl("")}
                className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {thumbnailMode === "upload" ? (
            <div
              onClick={() => thumbInputRef.current?.click()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) uploadThumbnail(file);
              }}
              onDragOver={(e) => e.preventDefault()}
              className="cursor-pointer rounded-lg border-2 border-dashed p-4 text-center hover:border-primary/50 transition-colors"
            >
              <input
                ref={thumbInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadThumbnail(file);
                }}
                className="hidden"
              />
              {thumbUploading ? (
                <p className="text-sm text-muted-foreground">Uploading...</p>
              ) : (
                <>
                  <ImageIcon className="mx-auto h-6 w-6 text-muted-foreground" />
                  <p className="mt-1 text-sm">Drop image here or click to browse</p>
                  <p className="text-xs text-muted-foreground">PNG, JPEG, WebP — max 2MB</p>
                </>
              )}
            </div>
          ) : (
            <Input
              type="url"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as SpaceType)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SPACE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Access Type</Label>
            <Select value={accessType} onValueChange={(v) => setAccessType(v as SpaceAccessType)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACCESS_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Subject</Label>
            <Input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Mathematics"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Labels</Label>
            <Input
              type="text"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              placeholder="comma-separated"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Assessment defaults */}
      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="font-medium">Assessment Defaults</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Time Limit (minutes, 0 = unlimited)</Label>
            <Input
              type="number"
              value={timeLimitMinutes}
              onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
              min={0}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={allowRetakes}
            onCheckedChange={setAllowRetakes}
            id="allow-retakes"
          />
          <Label htmlFor="allow-retakes" className="cursor-pointer">Allow retakes</Label>
        </div>

        {allowRetakes && (
          <div className="ml-6">
            <Label>Max Retakes</Label>
            <Input
              type="number"
              value={maxRetakes}
              onChange={(e) => setMaxRetakes(Number(e.target.value))}
              min={1}
              className="mt-1 w-32"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <Switch
            checked={showCorrectAnswers}
            onCheckedChange={setShowCorrectAnswers}
            id="show-correct-answers"
          />
          <Label htmlFor="show-correct-answers" className="cursor-pointer">
            Show correct answers after submission
          </Label>
        </div>
      </div>

      {/* Store Listing */}
      <div className="space-y-4 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Store Listing</h3>
          <div className="flex items-center gap-2">
            <Switch
              checked={publishedToStore}
              onCheckedChange={setPublishedToStore}
              id="published-to-store"
            />
            <Label htmlFor="published-to-store" className="cursor-pointer text-sm">
              Publish to Store
            </Label>
          </div>
        </div>

        {publishedToStore && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Price (0 = Free)</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  min={0}
                  step={0.01}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Store Description</Label>
              <Textarea
                value={storeDescription}
                onChange={(e) => setStoreDescription(e.target.value)}
                placeholder="A compelling description for the store listing..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Store Thumbnail URL</Label>
              <Input
                type="url"
                value={storeThumbnailUrl}
                onChange={(e) => setStoreThumbnailUrl(e.target.value)}
                placeholder="https://..."
                className="mt-1"
              />
            </div>
          </div>
        )}
      </div>

      <Button onClick={handleSave} disabled={saving || !title.trim()}>
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  );
}
