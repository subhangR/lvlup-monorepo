import { useState } from "react";
import { useCurrentTenantId, useCurrentMembership } from "@levelup/shared-stores";
import { callExportTenantData } from "@levelup/shared-services/auth";
import {
  Button,
  Label,
  Skeleton,
} from "@levelup/shared-ui";
import { toast } from "sonner";
import { useApiError } from "@levelup/shared-hooks";
import { Download, FileDown, Clock } from "lucide-react";

const COLLECTIONS = [
  { key: "students", label: "Students" },
  { key: "teachers", label: "Teachers" },
  { key: "classes", label: "Classes" },
  { key: "exams", label: "Exams" },
  { key: "submissions", label: "Submissions" },
] as const;

type ExportFormat = "json" | "csv";

interface ExportResult {
  downloadUrl: string;
  expiresAt: string;
  format: ExportFormat;
  collections: string[];
  exportedAt: string;
}

export default function DataExportPage() {
  const tenantId = useCurrentTenantId();
  const membership = useCurrentMembership();
  const { handleError } = useApiError();

  const [selectedCollections, setSelectedCollections] = useState<Set<string>>(new Set());
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [exporting, setExporting] = useState(false);
  const [exportResults, setExportResults] = useState<ExportResult[]>([]);

  // Permission check: only tenantAdmin or staff with canExportData
  const canExport =
    membership?.role === "tenantAdmin" ||
    (membership?.role === "staff" &&
      (membership as Record<string, unknown>).staffPermissions &&
      ((membership as Record<string, unknown>).staffPermissions as Record<string, boolean>)
        ?.canExportData);

  const toggleCollection = (key: string) => {
    setSelectedCollections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleExport = async () => {
    if (!tenantId || selectedCollections.size === 0) return;
    setExporting(true);
    try {
      const result = await callExportTenantData({
        tenantId,
        collections: Array.from(selectedCollections),
        format,
      });

      const exportResult: ExportResult = {
        downloadUrl: result.downloadUrl,
        expiresAt: result.expiresAt,
        format,
        collections: Array.from(selectedCollections),
        exportedAt: new Date().toISOString(),
      };

      setExportResults((prev) => [exportResult, ...prev]);
      toast.success("Export complete! Download your file below.");
    } catch (err) {
      handleError(err, "Failed to export data");
    } finally {
      setExporting(false);
    }
  };

  if (!canExport) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Data Export</h1>
          <p className="text-sm text-muted-foreground">
            You don&apos;t have permission to export data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Data Export</h1>
        <p className="text-sm text-muted-foreground">
          Export your school data in JSON or CSV format
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6 space-y-6">
        {/* Collection selector */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Select collections to export</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {COLLECTIONS.map(({ key, label }) => (
              <label
                key={key}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors ${
                  selectedCollections.has(key)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCollections.has(key)}
                  onChange={() => toggleCollection(key)}
                  className="rounded border-primary"
                />
                <span className="text-sm font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Format selector */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Export format</Label>
          <div className="flex gap-3">
            {(["csv", "json"] as const).map((f) => (
              <label
                key={f}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 transition-colors ${
                  format === f
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value={f}
                  checked={format === f}
                  onChange={() => setFormat(f)}
                  className="sr-only"
                />
                <span className="text-sm font-medium uppercase">{f}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Export button */}
        <Button
          onClick={handleExport}
          disabled={exporting || selectedCollections.size === 0}
          className="w-full sm:w-auto"
        >
          {exporting ? (
            <>Exporting...</>
          ) : (
            <>
              <FileDown className="mr-2 h-4 w-4" />
              Export Data
            </>
          )}
        </Button>
      </div>

      {/* Export results */}
      {exportResults.length > 0 && (
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <h3 className="font-semibold">Export History</h3>
          <div className="space-y-3">
            {exportResults.map((result, idx) => {
              const expiryDate = new Date(result.expiresAt);
              const isExpired = expiryDate < new Date();

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {result.collections.join(", ")} ({result.format.toUpperCase()})
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {isExpired
                          ? "Expired"
                          : `Expires ${expiryDate.toLocaleTimeString()}`}
                      </span>
                    </div>
                  </div>
                  {!isExpired && (
                    <a
                      href={result.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
