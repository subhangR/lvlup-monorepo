import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { getFirebaseServices, callSaveGlobalEvaluationPreset } from "@levelup/shared-services";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { EvaluationSettings, EvaluationDimension } from "@levelup/shared-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  Textarea,
  Checkbox,
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  PageHeader,
  Card,
  CardContent,
  Skeleton,
  Alert,
  AlertDescription,
  AlertTitle,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@levelup/shared-ui";
import { Sliders, AlertCircle, Pencil, Trash2, Plus } from "lucide-react";

const DEFAULT_DIMENSIONS: Omit<EvaluationDimension, "createdAt" | "createdBy">[] = [
  {
    id: "clarity",
    name: "Clarity",
    description: "How clearly the response communicates ideas",
    priority: "HIGH",
    promptGuidance: "Evaluate how clearly the student expressed their ideas",
    enabled: true,
    isDefault: true,
    isCustom: false,
    weight: 1,
    scoringScale: 5,
  },
  {
    id: "accuracy",
    name: "Accuracy",
    description: "Factual correctness of the response",
    priority: "HIGH",
    promptGuidance: "Evaluate the factual accuracy of the student's response",
    enabled: true,
    isDefault: true,
    isCustom: false,
    weight: 1,
    scoringScale: 5,
  },
  {
    id: "depth",
    name: "Depth",
    description: "Thoroughness and level of detail in the response",
    priority: "MEDIUM",
    promptGuidance: "Evaluate how thoroughly the student covered the topic",
    enabled: true,
    isDefault: true,
    isCustom: false,
    weight: 1,
    scoringScale: 5,
  },
  {
    id: "grammar",
    name: "Grammar",
    description: "Grammatical correctness and language usage",
    priority: "MEDIUM",
    promptGuidance: "Evaluate the grammatical correctness of the response",
    enabled: true,
    isDefault: true,
    isCustom: false,
    weight: 1,
    scoringScale: 5,
  },
  {
    id: "relevance",
    name: "Relevance",
    description: "How well the response addresses the question",
    priority: "HIGH",
    promptGuidance: "Evaluate how directly the student addressed the question",
    enabled: true,
    isDefault: true,
    isCustom: false,
    weight: 1,
    scoringScale: 5,
  },
  {
    id: "critical_thinking",
    name: "Critical Thinking",
    description: "Quality of reasoning and analytical thought",
    priority: "MEDIUM",
    promptGuidance: "Evaluate the quality of reasoning and analysis in the response",
    enabled: false,
    isDefault: false,
    isCustom: false,
    weight: 1,
    scoringScale: 5,
  },
];

const presetSchema = z.object({
  name: z.string().min(1, "Preset name is required"),
  description: z.string().optional(),
  isDefault: z.boolean(),
  isPublic: z.boolean(),
  displaySettings: z.object({
    showStrengths: z.boolean(),
    showKeyTakeaway: z.boolean(),
    prioritizeByImportance: z.boolean(),
  }),
  dimensions: z.record(z.string(), z.object({
    enabled: z.boolean(),
    weight: z.number().min(1).max(5),
  })),
});
type PresetFormValues = z.infer<typeof presetSchema>;

function emptyDefaults(): PresetFormValues {
  return {
    name: "",
    description: "",
    isDefault: false,
    isPublic: false,
    displaySettings: {
      showStrengths: true,
      showKeyTakeaway: true,
      prioritizeByImportance: false,
    },
    dimensions: Object.fromEntries(
      DEFAULT_DIMENSIONS.map((d) => [d.id, { enabled: d.enabled, weight: d.weight }])
    ),
  };
}

function presetToFormValues(preset: EvaluationSettings): PresetFormValues {
  const dimensions: Record<string, { enabled: boolean; weight: number }> = Object.fromEntries(
    DEFAULT_DIMENSIONS.map((d) => {
      const existing = preset.enabledDimensions?.find((ed) => ed.id === d.id);
      return [d.id, { enabled: existing?.enabled ?? d.enabled, weight: existing?.weight ?? d.weight }];
    })
  );
  for (const ed of preset.enabledDimensions ?? []) {
    if (!(ed.id in dimensions)) {
      dimensions[ed.id] = { enabled: ed.enabled, weight: ed.weight };
    }
  }
  return {
    name: preset.name ?? "",
    description: preset.description ?? "",
    isDefault: preset.isDefault ?? false,
    isPublic: preset.isPublic ?? false,
    displaySettings: {
      showStrengths: preset.displaySettings?.showStrengths ?? true,
      showKeyTakeaway: preset.displaySettings?.showKeyTakeaway ?? true,
      prioritizeByImportance: preset.displaySettings?.prioritizeByImportance ?? false,
    },
    dimensions,
  };
}

function formToEnabledDimensions(formValues: PresetFormValues): EvaluationDimension[] {
  return DEFAULT_DIMENSIONS.map((d) => ({
    ...d,
    enabled: formValues.dimensions[d.id]?.enabled ?? d.enabled,
    weight: formValues.dimensions[d.id]?.weight ?? d.weight,
  })) as EvaluationDimension[];
}

function useGlobalPresets() {
  return useQuery<EvaluationSettings[]>({
    queryKey: ["platform", "globalPresets"],
    queryFn: async () => {
      const { db } = getFirebaseServices();
      const colRef = collection(db, "evaluationSettings");
      const q = query(colRef, orderBy("name", "asc"));
      const snap = await getDocs(q);
      return snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as EvaluationSettings
      );
    },
    staleTime: 5 * 60 * 1000,
  });
}

export default function GlobalPresetsPage() {
  const queryClient = useQueryClient();
  const { data: presets, isLoading, isError, error, refetch } = useGlobalPresets();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EvaluationSettings | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<EvaluationSettings | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<PresetFormValues>({
    resolver: zodResolver(presetSchema),
    defaultValues: emptyDefaults(),
  });

  function openCreate() {
    form.reset(emptyDefaults());
    setSubmitError(null);
    setCreateOpen(true);
  }

  function openEdit(preset: EvaluationSettings) {
    setSelectedPreset(preset);
    form.reset(presetToFormValues(preset));
    setSubmitError(null);
    setEditOpen(true);
  }

  async function handleSubmit(values: PresetFormValues) {
    setIsPending(true);
    setSubmitError(null);
    try {
      await callSaveGlobalEvaluationPreset({
        id: editOpen ? selectedPreset?.id : undefined,
        data: {
          name: values.name,
          description: values.description || null,
          isDefault: values.isDefault,
          isPublic: values.isPublic,
          displaySettings: values.displaySettings,
          enabledDimensions: formToEnabledDimensions(values),
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["platform", "globalPresets"] });
      setCreateOpen(false);
      setEditOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setSubmitError(msg);
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete(preset: EvaluationSettings) {
    setIsPending(true);
    try {
      await callSaveGlobalEvaluationPreset({ id: preset.id, delete: true });
      await queryClient.invalidateQueries({ queryKey: ["platform", "globalPresets"] });
      setDeleteTarget(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setSubmitError(msg);
    } finally {
      setIsPending(false);
    }
  }

  const dialogOpen = createOpen || editOpen;
  const dialogTitle = editOpen ? "Edit Preset" : "Create Preset";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Evaluation Presets"
        description="Manage public evaluation feedback rubric presets available to all tenants"
        actions={
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Preset
          </Button>
        }
      />

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load data</AlertTitle>
          <AlertDescription className="flex items-center gap-2">
            {error instanceof Error ? error.message : "An unexpected error occurred."}
            <Button variant="link" className="h-auto p-0" onClick={() => refetch()}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-64" />
                <div className="flex gap-2 mt-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-6 w-20 rounded-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !presets?.length ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Sliders className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No global presets</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create evaluation presets that tenants can adopt
          </p>
          <Button variant="outline" className="mt-4 gap-2" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Create Preset
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {presets.map((preset) => (
            <Card
              key={preset.id}
              className="transition-shadow hover:shadow-sm"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{preset.name}</h3>
                      {preset.isDefault && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          Default
                        </span>
                      )}
                      {preset.isPublic && (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          Public
                        </span>
                      )}
                    </div>
                    {preset.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {preset.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(preset)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(preset)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Dimensions
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {preset.enabledDimensions?.map((dim) => (
                      <span
                        key={dim.id}
                        className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
                          dim.enabled
                            ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/50 dark:bg-blue-950/30 dark:text-blue-300"
                            : "border-transparent bg-muted text-muted-foreground line-through"
                        }`}
                      >
                        {dim.name}
                        {dim.weight !== 1 && dim.enabled ? (
                          <span className="ml-1 opacity-60">{dim.weight}x</span>
                        ) : null}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                  {[
                    { label: "Strengths", value: preset.displaySettings?.showStrengths },
                    { label: "Key Takeaway", value: preset.displaySettings?.showKeyTakeaway },
                    { label: "Priority Sort", value: preset.displaySettings?.prioritizeByImportance },
                  ].map((item) => (
                    <span key={item.label} className="flex items-center gap-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${item.value ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                      {item.label}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(o) => { if (!o) { setCreateOpen(false); setEditOpen(false); setSubmitError(null); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              {editOpen ? "Update the evaluation preset configuration" : "Configure a new evaluation rubric preset"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto space-y-5 py-2 px-1 -mx-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Standard RELMS Rubric" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Optional description" rows={2} className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Flags */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="isDefault"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="cursor-pointer">Set as default preset</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="cursor-pointer">Public (visible to all tenants)</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Display Settings */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Display Settings</p>
                  <div className="space-y-2 rounded-lg border p-3">
                    <FormField
                      control={form.control}
                      name="displaySettings.showStrengths"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="cursor-pointer">Show strengths</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="displaySettings.showKeyTakeaway"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="cursor-pointer">Show key takeaway</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="displaySettings.prioritizeByImportance"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="cursor-pointer">Prioritize by importance</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Dimensions */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Evaluation Dimensions</p>
                  <div className="space-y-1 rounded-lg border p-3">
                    {DEFAULT_DIMENSIONS.map((dim) => {
                      const dimensionValues = form.watch(`dimensions.${dim.id}`);
                      const isEnabled = dimensionValues?.enabled ?? dim.enabled;
                      return (
                        <div key={dim.id} className={`flex items-center gap-3 rounded-md px-2 py-2 transition-colors ${isEnabled ? "bg-muted/30" : ""}`}>
                          <FormField
                            control={form.control}
                            name={`dimensions.${dim.id}.enabled`}
                            render={({ field }) => (
                              <FormItem className="flex items-center space-y-0">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <label className="flex-1 cursor-pointer min-w-0">
                            <span className={`font-medium text-sm ${!isEnabled ? "text-muted-foreground" : ""}`}>{dim.name}</span>
                            <span className="ml-1 text-xs text-muted-foreground hidden sm:inline">
                              — {dim.description}
                            </span>
                          </label>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-xs text-muted-foreground">Weight:</span>
                            <FormField
                              control={form.control}
                              name={`dimensions.${dim.id}.weight`}
                              render={({ field }) => (
                                <FormItem className="space-y-0">
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min={1}
                                      max={5}
                                      value={field.value}
                                      onChange={(e) => field.onChange(Number(e.target.value) || 1)}
                                      className="h-7 w-14 text-center text-xs"
                                      disabled={!isEnabled}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {submitError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}
              </div>

              <DialogFooter className="flex-shrink-0 pt-2">
                <Button type="button" variant="outline" onClick={() => { setCreateOpen(false); setEditOpen(false); setSubmitError(null); }} disabled={isPending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Preset"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Preset</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deleteTarget?.name}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
