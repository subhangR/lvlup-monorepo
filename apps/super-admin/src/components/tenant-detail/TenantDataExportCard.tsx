import { useState } from "react";
import { useApiError } from "@levelup/shared-hooks";
import { sonnerToast as toast } from "@levelup/shared-ui";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@levelup/shared-ui";
import { Download, Check } from "lucide-react";
import { callExportTenantData } from "@levelup/shared-services/auth";

const EXPORT_COLLECTIONS = ["students", "teachers", "classes", "exams", "submissions"] as const;

interface Props {
  tenantId: string;
}

export function TenantDataExportCard({ tenantId }: Props) {
  const { handleError } = useApiError();
  const [exportFormat, setExportFormat] = useState<"json" | "csv">("csv");
  const [exportCollections, setExportCollections] = useState<string[]>(["students", "teachers", "classes"]);
  const [exporting, setExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);

  const handleExport = async () => {
    if (exportCollections.length === 0) return;
    setExporting(true);
    setExportUrl(null);
    try {
      const result = await callExportTenantData({
        tenantId,
        format: exportFormat,
        collections: exportCollections as (typeof EXPORT_COLLECTIONS[number])[],
      });
      setExportUrl(result.downloadUrl);
      toast.success(`Export ready: ${result.recordCount} records`);
    } catch (err) {
      handleError(err, "Failed to export data");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Data Export</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {EXPORT_COLLECTIONS.map((col) => {
            const isSelected = exportCollections.includes(col);
            return (
              <Button
                key={col}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setExportCollections((prev) =>
                    prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col],
                  )
                }
                className="capitalize h-7 text-xs gap-1"
              >
                {isSelected && <Check className="h-3 w-3" />}
                {col}
              </Button>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as "json" | "csv")}>
            <SelectTrigger className="w-24 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} disabled={exporting || exportCollections.length === 0} size="sm" className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            {exporting ? "Exporting..." : "Export"}
          </Button>
        </div>
        {exportUrl && (
          <a
            href={exportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-primary hover:bg-primary/10 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Download export (expires in 1 hour)
          </a>
        )}
      </CardContent>
    </Card>
  );
}
