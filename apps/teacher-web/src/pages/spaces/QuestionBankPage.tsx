import { useState, useCallback } from 'react';
import { useAuthStore } from '@levelup/shared-stores';
import { callListQuestionBank, callSaveQuestionBankItem } from '@levelup/shared-services';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Skeleton,
  sonnerToast as toast,
  Badge,
} from '@levelup/shared-ui';
import {
  Library,
  Search,
  Plus,
  Trash2,
  Filter,
  ChevronRight,
  Pencil,
  Copy,
} from 'lucide-react';
import type { QuestionBankItem, BloomsLevel } from '@levelup/shared-types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import QuestionBankEditor from '../../components/question-bank/QuestionBankEditor';

const BLOOMS_LEVELS: BloomsLevel[] = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];

const DIFFICULTY_OPTIONS = ['easy', 'medium', 'hard'] as const;
const QUESTION_TYPE_LABELS: Record<string, string> = {
  mcq: 'MCQ', mcaq: 'MCAQ', 'true-false': 'True/False', numerical: 'Numerical',
  text: 'Short Text', paragraph: 'Paragraph', code: 'Code',
  'fill-blanks': 'Fill Blanks', 'fill-blanks-dd': 'Fill Blanks DD',
  matching: 'Matching', jumbled: 'Jumbled', audio: 'Audio',
  image_evaluation: 'Image', 'group-options': 'Group Options',
  chat_agent_question: 'Chat Agent',
};

export default function QuestionBankPage() {
  const { currentTenantId } = useAuthStore();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [bloomsLevel, setBloomsLevel] = useState<string>('');
  const [questionType, setQuestionType] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<QuestionBankItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<QuestionBankItem | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['questionBank', currentTenantId, search, difficulty, bloomsLevel, questionType],
    queryFn: async () => {
      return callListQuestionBank({
        tenantId: currentTenantId!,
        search: search || undefined,
        difficulty: (difficulty as 'easy' | 'medium' | 'hard') || undefined,
        bloomsLevel: bloomsLevel || undefined,
        questionType: questionType || undefined,
        limit: 50,
      });
    },
    enabled: !!currentTenantId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await callSaveQuestionBankItem({
        id,
        tenantId: currentTenantId!,
        data: { deleted: true },
      });
    },
    onSuccess: () => {
      toast.success('Question deleted');
      queryClient.invalidateQueries({ queryKey: ['questionBank'] });
      setShowDeleteConfirm(null);
    },
    onError: () => {
      toast.error('Failed to delete question');
    },
  });

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  const items = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Library className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Question Bank</h1>
            <p className="text-sm text-muted-foreground">
              Reusable questions across all your spaces
            </p>
          </div>
        </div>
        <Button className="gap-2" onClick={() => { setEditingItem(null); setEditorOpen(true); }}>
          <Plus className="h-4 w-4" /> Add Question
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9"
            />
          </div>
        </div>

        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {DIFFICULTY_OPTIONS.map((d) => (
              <SelectItem key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={bloomsLevel} onValueChange={setBloomsLevel}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Bloom's Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {BLOOMS_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={questionType} onValueChange={setQuestionType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            {Object.entries(QUESTION_TYPE_LABELS).map(([type, label]) => (
              <SelectItem key={type} value={type}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(difficulty || bloomsLevel || questionType) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setDifficulty(''); setBloomsLevel(''); setQuestionType(''); }}
          >
            <Filter className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border bg-muted/50 p-8 text-center">
          <Library className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">
            {search ? 'No questions match your search.' : 'No questions in the bank yet.'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Save questions from your spaces or create new ones.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="w-full text-left rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {item.title || item.content.slice(0, 80)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {item.content}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {QUESTION_TYPE_LABELS[item.questionType] ?? item.questionType}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        item.difficulty === 'easy' ? 'border-emerald-300 text-emerald-700' :
                        item.difficulty === 'hard' ? 'border-red-300 text-red-700' :
                        'border-amber-300 text-amber-700'
                      }`}
                    >
                      {item.difficulty}
                    </Badge>
                    {item.bloomsLevel && (
                      <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                        {item.bloomsLevel}
                      </Badge>
                    )}
                    {item.subject && (
                      <span className="text-xs text-muted-foreground">{item.subject}</span>
                    )}
                    {item.usageCount > 0 && (
                      <span className="text-xs text-muted-foreground">
                        Used {item.usageCount}x
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingItem(item);
                      setEditorOpen(true);
                    }}
                    className="h-8 w-8 p-0"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingItem({ ...item, id: '' } as QuestionBankItem);
                      setEditorOpen(true);
                    }}
                    className="h-8 w-8 p-0"
                    title="Duplicate"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(item.id);
                    }}
                    className="text-destructive h-8 w-8 p-0"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Question Preview Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Question Preview</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">{selectedItem.title || 'Untitled'}</p>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                  {selectedItem.content}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  {QUESTION_TYPE_LABELS[selectedItem.questionType] ?? selectedItem.questionType}
                </Badge>
                <Badge variant="outline">{selectedItem.difficulty}</Badge>
                {selectedItem.bloomsLevel && (
                  <Badge variant="outline">{selectedItem.bloomsLevel}</Badge>
                )}
                <Badge variant="outline">{selectedItem.basePoints ?? 1} pts</Badge>
              </div>
              {selectedItem.topics.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Topics</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.topics.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {selectedItem.tags.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.tags.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {selectedItem.averageScore != null && (
                <p className="text-xs text-muted-foreground">
                  Average score: {Math.round(selectedItem.averageScore * 100)}%
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedItem(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Question?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently remove this question from the bank. Questions already imported into spaces will not be affected.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => showDeleteConfirm && deleteMutation.mutate(showDeleteConfirm)}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Question Bank Editor */}
      {currentTenantId && (
        <QuestionBankEditor
          open={editorOpen}
          onOpenChange={setEditorOpen}
          tenantId={currentTenantId}
          item={editingItem}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ['questionBank'] });
          }}
        />
      )}
    </div>
  );
}
