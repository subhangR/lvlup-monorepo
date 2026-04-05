import { useState, useRef, useCallback } from "react";
import { callUploadTenantAsset } from "@levelup/shared-services/auth";
import { Label } from "@levelup/shared-ui";
import { toast } from "sonner";
import { X, ImageIcon } from "lucide-react";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/svg+xml", "image/webp"]);

interface LogoUploaderProps {
  tenantId: string;
  currentLogoUrl: string;
  onUploaded: (url: string) => void;
}

export default function LogoUploader({ tenantId, currentLogoUrl, onUploaded }: LogoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string>(currentLogoUrl);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.has(file.type)) {
      return "Only PNG, JPEG, SVG, and WebP images are allowed";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be under 2MB";
    }
    return null;
  };

  const uploadFile = useCallback(
    async (file: File) => {
      const error = validateFile(file);
      if (error) {
        toast.error(error);
        return;
      }

      setUploading(true);
      setProgress(10);

      try {
        // Get signed upload URL
        const { uploadUrl, publicUrl } = await callUploadTenantAsset({
          tenantId,
          assetType: "logo",
          contentType: file.type,
        });

        setProgress(30);

        // Upload directly to Cloud Storage
        const xhr = new XMLHttpRequest();
        await new Promise<void>((resolve, reject) => {
          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              setProgress(30 + Math.round((e.loaded / e.total) * 60));
            }
          });
          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          });
          xhr.addEventListener("error", () => reject(new Error("Upload failed")));
          xhr.open("PUT", uploadUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });

        setProgress(100);
        setPreview(publicUrl);
        onUploaded(publicUrl);
        toast.success("Logo uploaded successfully");
      } catch (err) {
        toast.error("Failed to upload logo", {
          description: err instanceof Error ? err.message : "Please try again",
        });
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [tenantId, onUploaded]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const clearPreview = () => {
    setPreview("");
    onUploaded("");
  };

  return (
    <div className="space-y-3">
      <Label>School Logo</Label>

      {/* Preview */}
      {preview && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Logo preview"
            loading="lazy"
            decoding="async"
            className="bg-muted h-16 w-16 rounded-lg border object-cover"
          />
          <button
            type="button"
            onClick={clearPreview}
            className="bg-destructive text-destructive-foreground absolute -right-1 -top-1 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        {uploading ? (
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Uploading...</p>
            <div className="bg-muted mx-auto h-1.5 w-48 overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <ImageIcon className="text-muted-foreground mx-auto h-8 w-8" />
            <p className="mt-2 text-sm font-medium">Drop your logo here or click to browse</p>
            <p className="text-muted-foreground text-xs">PNG, JPEG, SVG, or WebP — max 2MB</p>
          </>
        )}
      </div>
    </div>
  );
}
