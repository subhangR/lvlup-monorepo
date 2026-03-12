import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { getFirebaseServices, callImportFromBank } from "@levelup/shared-services";
import type { QuestionBankItem } from "@levelup/shared-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Input,
  Badge,
  Skeleton,
} from "@levelup/shared-ui";
import { Search, Check, Library, AlertCircle } from "lucide-react";

interface QuestionBankImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string;
  spaceId: string;
  storyPointId: string;
  onImported: () => void;
}

export default function QuestionBankImportDialog({
  open,
  onOpenChange,
  tenantId,
  spaceId,
  storyPointId,
  onImported,
}: QuestionBankImportDialogProps) {
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Load question bank items
  useEffect(() => {
    if (!open || !tenantId) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { db } = getFirebaseServices();
        const q = query(
          collection(db, `tenants/${tenantId}/questionBank`),
          orderBy("createdAt", "desc"),
          limit(100),
        );
        const snap = await getDocs(q);
        setQuestions(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as QuestionBankItem));
      } catch (err) {
        setError("Failed to load question bank");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open, tenantId]);

  const filtered = questions.filter((q) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      q.content?.toLowerCase().includes(term) ||
      q.title?.toLowerCase().includes(term) ||
      q.subject?.toLowerCase().includes(term) ||
      q.topics?.some((t) => t.toLowerCase().includes(term))
    );
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleImport = async () => {
    if (selected.size === 0) return;
    setImporting(true);
    setError(null);
    try {
      await callImportFromBank({
        tenantId,
        spaceId,
        storyPointId,
        questionBankItemIds: Array.from(selected),
      });
      setSelected(new Set());
      onImported();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Library className="h-5 w-5" />
            Import from Question Bank
          </DialogTitle>
          <DialogDescription>
            Select questions to import into this story point.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by content, subject, or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-2 min-h-[200px] max-h-[400px]">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
            </>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8">
              <Library className="h-8 w-8 mx-auto text-muted-foreground/30" />
              <p className="mt-2 text-sm text-muted-foreground">
                {questions.length === 0
                  ? "No questions in the bank yet. Add questions from the Question Bank page."
                  : "No matching questions found."}
              </p>
            </div>
          ) : (
            filtered.map((q) => {
              const isSelected = selected.has(q.id);
              return (
                <button
                  key={q.id}
                  onClick={() => toggleSelect(q.id)}
                  className={`w-full text-left rounded-lg border p-3 transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 mt-0.5 h-5 w-5 rounded border flex items-center justify-center ${
                      isSelected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30"
                    }`}>
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">
                        {q.title || q.content}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="outline" className="text-[10px]">{q.questionType}</Badge>
                        {q.difficulty && (
                          <Badge variant="secondary" className="text-[10px] capitalize">{q.difficulty}</Badge>
                        )}
                        {q.subject && (
                          <span className="text-[10px] text-muted-foreground">{q.subject}</span>
                        )}
                        {q.usageCount > 0 && (
                          <span className="text-[10px] text-muted-foreground">
                            Used {q.usageCount}x
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <span className="text-sm text-muted-foreground">
            {selected.size} question{selected.size !== 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleImport}
              disabled={selected.size === 0 || importing}
            >
              {importing ? "Importing..." : `Import ${selected.size > 0 ? `(${selected.size})` : ""}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
