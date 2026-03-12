import { useState, useEffect } from "react";
import { useCurrentTenantId } from "@levelup/shared-stores";
import { useEvaluationSettings, useApiError } from "@levelup/shared-hooks";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseServices } from "@levelup/shared-services";
import type { EvaluationSettings } from "@levelup/shared-types";
import { Save, Settings } from "lucide-react";
import {
  Button,
  Label,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  sonnerToast,
} from "@levelup/shared-ui";

interface EvaluationSettingsWithFields extends EvaluationSettings {
  autoGrade?: boolean;
  requireOverrideReason?: boolean;
  releaseResultsAutomatically?: boolean;
  defaultStrictness?: string;
}

export default function SettingsPage() {
  const tenantId = useCurrentTenantId();
  const { data: settingsData, refetch } = useEvaluationSettings(tenantId);
  const [saving, setSaving] = useState(false);
  const { handleError } = useApiError();

  const settings: EvaluationSettingsWithFields | null = Array.isArray(settingsData)
    ? settingsData[0] ?? null
    : settingsData;

  const [autoGrade, setAutoGrade] = useState(true);
  const [requireOverrideReason, setRequireOverrideReason] = useState(true);
  const [releaseResultsAutomatically, setReleaseResultsAutomatically] =
    useState(false);
  const [defaultStrictness, setDefaultStrictness] = useState("moderate");

  useEffect(() => {
    if (settings) {
      setAutoGrade(settings.autoGrade ?? true);
      setRequireOverrideReason(settings.requireOverrideReason ?? true);
      setReleaseResultsAutomatically(settings.releaseResultsAutomatically ?? false);
      setDefaultStrictness(settings.defaultStrictness ?? "moderate");
    }
  }, [settings]);

  const handleSave = async () => {
    if (!tenantId || !settings?.id) return;
    setSaving(true);
    try {
      const { db } = getFirebaseServices();
      await updateDoc(
        doc(db, `tenants/${tenantId}/evaluationSettings`, settings.id),
        {
          autoGrade,
          requireOverrideReason,
          releaseResultsAutomatically,
          defaultStrictness,
          updatedAt: serverTimestamp(),
        }
      );
      await refetch();
      sonnerToast.success("Settings saved successfully");
    } catch (err) {
      handleError(err, "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Evaluation and grading configuration
        </p>
      </div>

      <div className="max-w-xl space-y-6">
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold">Evaluation Settings</h2>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Auto Grade</p>
                <p className="text-xs text-muted-foreground">
                  Automatically grade submissions using AI
                </p>
              </div>
              <Switch checked={autoGrade} onCheckedChange={setAutoGrade} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Require Override Reason</p>
                <p className="text-xs text-muted-foreground">
                  Mandate a reason when manually overriding AI grades
                </p>
              </div>
              <Switch checked={requireOverrideReason} onCheckedChange={setRequireOverrideReason} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  Auto-release Results
                </p>
                <p className="text-xs text-muted-foreground">
                  Release results automatically after grading completes
                </p>
              </div>
              <Switch checked={releaseResultsAutomatically} onCheckedChange={setReleaseResultsAutomatically} />
            </div>

            <div>
              <Label>Default AI Strictness</Label>
              <Select value={defaultStrictness} onValueChange={setDefaultStrictness}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lenient">Lenient</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="strict">Strict</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {!settings && (
          <p className="text-sm text-muted-foreground">
            No evaluation settings configured for this tenant yet.
          </p>
        )}

        {settings && (
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        )}
      </div>
    </div>
  );
}
