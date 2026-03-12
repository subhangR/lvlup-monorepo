import { useState, useMemo } from 'react';
import { useAuthStore } from '@levelup/shared-stores';
import { getFirebaseServices, callSaveRubricPreset } from '@levelup/shared-services';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Skeleton,
  sonnerToast as toast,
} from '@levelup/shared-ui';
import { Sparkles, BookOpen, Save } from 'lucide-react';
import type { RubricPreset, UnifiedRubric, RubricPresetCategory } from '@levelup/shared-types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface RubricPresetPickerProps {
  /** Current rubric value (for "Save as Preset") */
  currentRubric?: UnifiedRubric;
  /** Called when user selects a preset to apply */
  onApply: (rubric: UnifiedRubric) => void;
  /** Filter presets by category */
  filterCategory?: RubricPresetCategory;
}

const CATEGORY_LABELS: Record<RubricPresetCategory, string> = {
  general: 'General',
  math: 'Mathematics',
  science: 'Science',
  language: 'Language Arts',
  coding: 'Coding',
  essay: 'Essay Writing',
  custom: 'Custom',
};

export default function RubricPresetPicker({
  currentRubric,
  onApply,
  filterCategory,
}: RubricPresetPickerProps) {
  const { currentTenantId } = useAuthStore();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>(filterCategory ?? '');
  const [selectedPreset, setSelectedPreset] = useState<RubricPreset | null>(null);
  const [saveName, setSaveName] = useState('');
  const [saveCategory, setSaveCategory] = useState<string>('custom');

  // Load presets
  const { data: presets, isLoading } = useQuery({
    queryKey: ['rubricPresets', currentTenantId],
    queryFn: async () => {
      if (!currentTenantId) return [];
      const { db } = getFirebaseServices();
      const colRef = collection(db, `tenants/${currentTenantId}/rubricPresets`);
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map((doc) => doc.data() as RubricPreset);
    },
    enabled: !!currentTenantId && open,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!currentRubric || !saveName.trim() || !currentTenantId) return;
      await callSaveRubricPreset({
        tenantId: currentTenantId,
        data: {
          name: saveName.trim(),
          rubric: currentRubric,
          category: saveCategory,
        },
      });
    },
    onSuccess: () => {
      toast.success('Rubric preset saved');
      queryClient.invalidateQueries({ queryKey: ['rubricPresets'] });
      setSaveOpen(false);
      setSaveName('');
    },
    onError: () => {
      toast.error('Failed to save preset');
    },
  });

  const filteredPresets = (presets ?? []).filter((p) =>
    !categoryFilter || p.category === categoryFilter,
  );

  const handleApply = () => {
    if (selectedPreset) {
      onApply(selectedPreset.rubric);
      setOpen(false);
      setSelectedPreset(null);
      toast.success(`Applied "${selectedPreset.name}" preset`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-1.5">
        <Sparkles className="h-3.5 w-3.5" /> Apply Preset
      </Button>

      {currentRubric && (
        <Button variant="ghost" size="sm" onClick={() => setSaveOpen(true)} className="gap-1.5">
          <Save className="h-3.5 w-3.5" /> Save as Preset
        </Button>
      )}

      {/* Preset Picker Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> Rubric Presets
            </DialogTitle>
          </DialogHeader>

          <div className="mb-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {isLoading ? (
              [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-lg" />)
            ) : filteredPresets.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No presets available. Save your current rubric as a preset to get started.
              </p>
            ) : (
              filteredPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset)}
                  className={`w-full text-left rounded-lg border p-3 transition-all ${
                    selectedPreset?.id === preset.id
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{preset.name}</p>
                      {preset.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {preset.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1.5">
                      <Badge variant="outline" className="text-xs">
                        {CATEGORY_LABELS[preset.category]}
                      </Badge>
                      {preset.isDefault && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                    </div>
                  </div>
                  {preset.rubric.criteria && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {preset.rubric.criteria.length} criteria &middot; {preset.rubric.scoringMode}
                    </p>
                  )}
                </button>
              ))
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleApply} disabled={!selectedPreset}>
              Apply Preset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save as Preset Dialog */}
      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as Rubric Preset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Preset Name</label>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="e.g., Math Problem Rubric"
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={saveCategory} onValueChange={setSaveCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveOpen(false)}>Cancel</Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={!saveName.trim() || saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Saving...' : 'Save Preset'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
