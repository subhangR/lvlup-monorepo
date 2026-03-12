import { useState, useRef, useEffect, useCallback } from "react";
import type {
  UnifiedItem,
  QuestionType,
  MaterialType,
  QuestionPayload,
  MaterialPayload,
  QuestionTypeData,
  MCQData,
  MCAQData,
  TrueFalseData,
  NumericalData,
  TextData,
  ParagraphData,
  CodeData,
  FillBlanksData,
  FillBlanksDDData,
  MatchingData,
  JumbledData,
  AudioData,
  ImageEvaluationData,
  GroupOptionsData,
  ChatAgentQuestionData,
  MCQOption,
  CodeTestCase,
  FillBlank,
  MatchingPair,
  JumbledItem,
  GroupOptionsGroup,
  GroupOptionsItem as GOItem,
  ItemAttachment,
} from "@levelup/shared-types";
import { ArrowLeft, Save, Plus, Trash2, Paperclip, X, FileIcon, ImageIcon, Music } from "lucide-react";
import { uploadItemMedia, deleteItemMedia } from "@levelup/shared-services";
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
  RichTextEditor,
  sonnerToast,
} from "@levelup/shared-ui";

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: "mcq", label: "Multiple Choice (Single)" },
  { value: "mcaq", label: "Multiple Choice (Multiple)" },
  { value: "true-false", label: "True / False" },
  { value: "numerical", label: "Numerical" },
  { value: "text", label: "Short Text" },
  { value: "paragraph", label: "Paragraph" },
  { value: "code", label: "Code" },
  { value: "fill-blanks", label: "Fill in the Blanks" },
  { value: "fill-blanks-dd", label: "Fill Blanks (Dropdown)" },
  { value: "matching", label: "Matching" },
  { value: "jumbled", label: "Jumbled / Ordering" },
  { value: "audio", label: "Audio Response" },
  { value: "image_evaluation", label: "Image Evaluation" },
  { value: "group-options", label: "Group Options" },
  { value: "chat_agent_question", label: "Chat Agent" },
];

const MATERIAL_TYPES: { value: MaterialType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "video", label: "Video" },
  { value: "pdf", label: "PDF" },
  { value: "link", label: "Link" },
  { value: "interactive", label: "Interactive" },
  { value: "story", label: "Story" },
  { value: "rich", label: "Rich Content" },
];

interface Props {
  item: UnifiedItem;
  tenantId?: string;
  spaceId?: string;
  onSave: (item: UnifiedItem) => Promise<void>;
  onCancel: () => void;
}

// Helper to get default question data for a given type
function defaultQuestionData(qt: QuestionType): QuestionTypeData {
  switch (qt) {
    case "mcq":
      return { options: [], shuffleOptions: false } satisfies MCQData;
    case "mcaq":
      return { options: [], minSelections: 1, shuffleOptions: false } satisfies MCAQData;
    case "true-false":
      return { correctAnswer: true } satisfies TrueFalseData;
    case "numerical":
      return { correctAnswer: 0, tolerance: 0 } satisfies NumericalData;
    case "text":
      return { correctAnswer: "", maxLength: 500 } satisfies TextData;
    case "paragraph":
      return { maxLength: 5000, minLength: 50 } satisfies ParagraphData;
    case "code":
      return { language: "python", testCases: [] } satisfies CodeData;
    case "fill-blanks":
      return { textWithBlanks: "", blanks: [] } satisfies FillBlanksData;
    case "fill-blanks-dd":
      return { textWithBlanks: "", blanks: [] } satisfies FillBlanksDDData;
    case "matching":
      return { pairs: [] } satisfies MatchingData;
    case "jumbled":
      return { correctOrder: [], items: [] } satisfies JumbledData;
    case "audio":
      return { maxDurationSeconds: 120 } satisfies AudioData;
    case "image_evaluation":
      return { instructions: "", maxImages: 1 } satisfies ImageEvaluationData;
    case "group-options":
      return { groups: [], items: [] } satisfies GroupOptionsData;
    case "chat_agent_question":
      return { objectives: [], maxTurns: 10 } satisfies ChatAgentQuestionData;
    default:
      return {} as QuestionTypeData;
  }
}

export default function ItemEditor({ item, tenantId, spaceId, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(item.title ?? "");
  const [content, setContent] = useState(item.content ?? "");
  const [type] = useState(item.type);
  const [difficulty, setDifficulty] = useState(item.difficulty ?? "medium");
  const [payload, setPayload] = useState(item.payload);
  const [saving, setSaving] = useState(false);
  const [attachments, setAttachments] = useState<ItemAttachment[]>(item.attachments ?? []);
  const [uploading, setUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isQuestion = type === "question";
  const qPayload = payload as QuestionPayload;
  const mPayload = payload as MaterialPayload;

  const questionType = isQuestion ? qPayload.questionType : null;
  const materialType = !isQuestion ? mPayload.materialType : null;

  // Mark as unsaved when any field changes
  const markUnsaved = useCallback(() => {
    setHasUnsavedChanges(true);
    setSaveStatus("unsaved");
  }, []);

  // Auto-save debounce (2s after last edit)
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      performAutoSave();
    }, 2000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, difficulty, payload, attachments, hasUnsavedChanges]);

  const performAutoSave = async () => {
    setSaveStatus("saving");
    try {
      await onSave({
        ...item,
        title,
        content,
        difficulty: difficulty as UnifiedItem['difficulty'],
        attachments,
        payload: isQuestion
          ? { ...qPayload, content: content || qPayload.content }
          : mPayload,
      });
      setSaveStatus("saved");
      setHasUnsavedChanges(false);
    } catch {
      setSaveStatus("unsaved");
    }
  };

  // Wrap state setters to trigger unsaved tracking
  const setTitleTracked = (v: string) => { setTitle(v); markUnsaved(); };
  const setContentTracked = (v: string) => { setContent(v); markUnsaved(); };
  const setDifficultyTracked = (v: string) => { setDifficulty(v); markUnsaved(); };

  const handleChangeQuestionType = (qt: QuestionType) => {
    setPayload({
      ...qPayload,
      questionType: qt,
      questionData: defaultQuestionData(qt),
    });
    markUnsaved();
  };

  const handleChangeMaterialType = (mt: MaterialType) => {
    setPayload({ ...mPayload, materialType: mt });
    markUnsaved();
  };

  const updateQD = (updates: Partial<QuestionTypeData>) => {
    setPayload({
      ...qPayload,
      questionData: { ...qPayload.questionData, ...updates },
    });
    markUnsaved();
  };

  const handleFileUpload = async (files: FileList) => {
    if (!tenantId || !spaceId) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const result = await uploadItemMedia(tenantId, spaceId, item.id, file);
        setAttachments((prev) => [...prev, result]);
      }
      sonnerToast.success("Files uploaded");
    } catch (err) {
      sonnerToast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAttachment = async (attachment: ItemAttachment) => {
    if (!tenantId || !spaceId) return;
    try {
      await deleteItemMedia(tenantId, spaceId, item.id, attachment.fileName, attachment.id);
      setAttachments((prev) => prev.filter((a) => a.id !== attachment.id));
      sonnerToast.success("Attachment removed");
    } catch {
      sonnerToast.error("Failed to remove attachment");
    }
  };

  const handleSave = async () => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    setSaving(true);
    setSaveStatus("saving");
    try {
      await onSave({
        ...item,
        title,
        content,
        difficulty: difficulty as UnifiedItem['difficulty'],
        attachments,
        payload: isQuestion
          ? { ...qPayload, content: content || qPayload.content }
          : mPayload,
      });
      setSaveStatus("saved");
      setHasUnsavedChanges(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (hasUnsavedChanges) {
              if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
                onCancel();
              }
            } else {
              onCancel();
            }
          }}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">
          Edit {isQuestion ? "Question" : "Material"}
        </h1>
        <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
          saveStatus === "saved"
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : saveStatus === "saving"
            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
            : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
        }`}>
          {saveStatus === "saved" ? "Saved" : saveStatus === "saving" ? "Saving..." : "Unsaved changes"}
        </span>
      </div>

      <div className="max-w-3xl space-y-5">
        {/* Common fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Title</Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitleTracked(e.target.value)}
              className="mt-1"
            />
          </div>

          {isQuestion && (
            <div>
              <Label>Question Type</Label>
              <Select
                value={questionType ?? "mcq"}
                onValueChange={(v) => handleChangeQuestionType(v as QuestionType)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUESTION_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {!isQuestion && (
            <div>
              <Label>Material Type</Label>
              <Select
                value={materialType ?? "text"}
                onValueChange={(v) => handleChangeMaterialType(v as MaterialType)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MATERIAL_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Difficulty</Label>
            <Select value={difficulty} onValueChange={setDifficultyTracked}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>
            {isQuestion ? "Question Content" : "Content"}
          </Label>
          <RichTextEditor
            content={content}
            onChange={setContentTracked}
            placeholder={
              isQuestion
                ? "Enter the question text..."
                : "Enter content or URL..."
            }
            className="mt-1"
          />
        </div>

        {/* Question-type specific editors */}
        {isQuestion && (
          <div className="rounded-lg border p-4 space-y-4">
            <h3 className="font-medium capitalize">
              {questionType?.replace(/[-_]/g, " ")} Configuration
            </h3>
            <QuestionDataEditor
              questionType={questionType!}
              data={qPayload.questionData}
              onChange={updateQD}
            />

            {/* Base points and explanation */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Base Points</Label>
                <Input
                  type="number"
                  value={qPayload.basePoints ?? 1}
                  onChange={(e) =>
                    setPayload({
                      ...qPayload,
                      basePoints: Number(e.target.value),
                    })
                  }
                  min={0}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label>Explanation (shown after answering)</Label>
              <Textarea
                value={qPayload.explanation ?? ""}
                onChange={(e) =>
                  setPayload({ ...qPayload, explanation: e.target.value || undefined })
                }
                rows={2}
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Material-type specific editors */}
        {!isQuestion && (
          <div className="rounded-lg border p-4 space-y-4">
            <h3 className="font-medium capitalize">
              {materialType?.replace(/[-_]/g, " ")} Configuration
            </h3>
            <MaterialDataEditor
              materialType={materialType!}
              data={mPayload}
              onChange={(updates) => setPayload({ ...mPayload, ...updates })}
            />
          </div>
        )}

        {/* Media Attachments */}
        {tenantId && spaceId && (
          <div>
            <Label>Attachments</Label>
            <div className="mt-1 space-y-2">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                  {attachment.type === "image" ? (
                    <ImageIcon className="h-4 w-4 text-blue-500" />
                  ) : attachment.type === "audio" ? (
                    <Music className="h-4 w-4 text-purple-500" />
                  ) : (
                    <FileIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span className="flex-1 truncate">{attachment.fileName}</span>
                  <span className="text-xs text-muted-foreground">
                    {(attachment.size / 1024).toFixed(0)}KB
                  </span>
                  <button
                    onClick={() => handleRemoveAttachment(attachment)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Remove attachment"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf,audio/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) handleFileUpload(e.target.files);
                  e.target.value = "";
                }}
              />
              <Button
                variant="outline"
                size="sm"
                className="border-dashed"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Paperclip className="h-3.5 w-3.5" />
                {uploading ? "Uploading..." : "Add Attachment"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Max 10MB per file. Supported: images, PDFs, audio.
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Item"}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
// Question Data Editor (all 15 types)
// ─────────────────────────────────────────────────

function QuestionDataEditor({
  questionType,
  data,
  onChange,
}: {
  questionType: QuestionType;
  data: QuestionTypeData;
  onChange: (updates: Partial<QuestionTypeData>) => void;
}) {
  switch (questionType) {
    case "mcq":
    case "mcaq":
      return <MCQEditor data={data as MCQData | MCAQData} onChange={onChange} multi={questionType === "mcaq"} />;
    case "true-false":
      return <TrueFalseEditor data={data as TrueFalseData} onChange={onChange} />;
    case "numerical":
      return <NumericalEditor data={data as NumericalData} onChange={onChange} />;
    case "text":
      return <TextEditor data={data as TextData} onChange={onChange} />;
    case "paragraph":
      return <ParagraphEditor data={data as ParagraphData} onChange={onChange} />;
    case "code":
      return <CodeEditor data={data as CodeData} onChange={onChange} />;
    case "fill-blanks":
      return <FillBlanksEditor data={data as FillBlanksData} onChange={onChange} />;
    case "fill-blanks-dd":
      return <FillBlanksDDEditor data={data as FillBlanksDDData} onChange={onChange} />;
    case "matching":
      return <MatchingEditor data={data as MatchingData} onChange={onChange} />;
    case "jumbled":
      return <JumbledEditor data={data as JumbledData} onChange={onChange} />;
    case "audio":
      return <AudioEditor data={data as AudioData} onChange={onChange} />;
    case "image_evaluation":
      return <ImageEvalEditor data={data as ImageEvaluationData} onChange={onChange} />;
    case "group-options":
      return <GroupOptionsEditor data={data as GroupOptionsData} onChange={onChange} />;
    case "chat_agent_question":
      return <ChatAgentEditor data={data as ChatAgentQuestionData} onChange={onChange} />;
    default:
      return <p className="text-sm text-muted-foreground">No editor for this type</p>;
  }
}

// ── MCQ / MCAQ ──────────────────────────────────

function MCQEditor({
  data,
  onChange,
  multi,
}: {
  data: MCQData | MCAQData;
  onChange: (u: Partial<MCQData & MCAQData>) => void;
  multi: boolean;
}) {
  const options: MCQOption[] = data.options ?? [];

  const addOption = () => {
    onChange({
      options: [
        ...options,
        { id: `opt_${Date.now()}`, text: "", isCorrect: false },
      ],
    });
  };

  const updateOption = (idx: number, updates: Partial<MCQOption>) => {
    const updated = options.map((o, i) => {
      if (i !== idx) return multi ? o : { ...o, ...(updates.isCorrect ? { isCorrect: false } : {}) };
      return { ...o, ...updates };
    });
    // For single MCQ, only one can be correct
    if (!multi && updates.isCorrect) {
      updated.forEach((o, i) => {
        if (i !== idx) o.isCorrect = false;
      });
    }
    onChange({ options: updated });
  };

  const removeOption = (idx: number) => {
    onChange({ options: options.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Switch
          checked={data.shuffleOptions ?? false}
          onCheckedChange={(v) => onChange({ shuffleOptions: v })}
          id="shuffle-options-mcq"
        />
        <Label htmlFor="shuffle-options-mcq" className="cursor-pointer text-sm">Shuffle options</Label>
      </div>
      {options.map((opt, idx) => (
        <div key={opt.id} className="flex items-center gap-2">
          <input
            type={multi ? "checkbox" : "radio"}
            checked={opt.isCorrect}
            onChange={(e) => updateOption(idx, { isCorrect: e.target.checked })}
            name="correct_option"
            className="mt-0.5"
          />
          <Input
            type="text"
            value={opt.text}
            onChange={(e) => updateOption(idx, { text: e.target.value })}
            placeholder={`Option ${idx + 1}`}
            className="h-8 flex-1"
          />
          <Input
            type="text"
            value={opt.explanation ?? ""}
            onChange={(e) =>
              updateOption(idx, { explanation: e.target.value || undefined })
            }
            placeholder="Explanation"
            className="h-8 w-48"
          />
          <Button variant="ghost" size="icon" onClick={() => removeOption(idx)} className="h-8 w-8 text-muted-foreground hover:text-destructive" aria-label="Remove option">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addOption}>
        <Plus className="h-3 w-3" /> Add Option
      </Button>
    </div>
  );
}

// ── True/False ──────────────────────────────────

function TrueFalseEditor({
  data,
  onChange,
}: {
  data: TrueFalseData;
  onChange: (u: Partial<TrueFalseData>) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Correct Answer</Label>
        <div className="mt-1 flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={data.correctAnswer === true}
              onChange={() => onChange({ correctAnswer: true })}
            />
            True
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={data.correctAnswer === false}
              onChange={() => onChange({ correctAnswer: false })}
            />
            False
          </label>
        </div>
      </div>
      <div>
        <Label>Explanation</Label>
        <Textarea
          value={data.explanation ?? ""}
          onChange={(e) => onChange({ explanation: e.target.value || undefined })}
          rows={2}
          className="mt-1"
        />
      </div>
    </div>
  );
}

// ── Numerical ───────────────────────────────────

function NumericalEditor({
  data,
  onChange,
}: {
  data: NumericalData;
  onChange: (u: Partial<NumericalData>) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div>
        <Label>Correct Answer</Label>
        <Input
          type="number"
          value={data.correctAnswer ?? 0}
          onChange={(e) => onChange({ correctAnswer: Number(e.target.value) })}
          className="mt-1"
        />
      </div>
      <div>
        <Label>Tolerance (+/-)</Label>
        <Input
          type="number"
          value={data.tolerance ?? 0}
          onChange={(e) => onChange({ tolerance: Number(e.target.value) })}
          step="0.01"
          className="mt-1"
        />
      </div>
      <div>
        <Label>Unit</Label>
        <Input
          type="text"
          value={data.unit ?? ""}
          onChange={(e) => onChange({ unit: e.target.value || undefined })}
          placeholder="e.g. kg, m/s"
          className="mt-1"
        />
      </div>
    </div>
  );
}

// ── Short Text ──────────────────────────────────

function TextEditor({
  data,
  onChange,
}: {
  data: TextData;
  onChange: (u: Partial<TextData>) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Correct Answer</Label>
        <Input
          type="text"
          value={data.correctAnswer ?? ""}
          onChange={(e) => onChange({ correctAnswer: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label>Acceptable Answers (comma-separated)</Label>
        <Input
          type="text"
          value={data.acceptableAnswers?.join(", ") ?? ""}
          onChange={(e) =>
            onChange({
              acceptableAnswers: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          className="mt-1"
        />
      </div>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={data.caseSensitive ?? false}
            onCheckedChange={(v) => onChange({ caseSensitive: v })}
            id="case-sensitive"
          />
          <Label htmlFor="case-sensitive" className="cursor-pointer text-sm">Case sensitive</Label>
        </div>
        <div>
          <Label>Max Length</Label>
          <Input
            type="number"
            value={data.maxLength ?? 500}
            onChange={(e) => onChange({ maxLength: Number(e.target.value) })}
            className="ml-2 h-8 w-24"
          />
        </div>
      </div>
    </div>
  );
}

// ── Paragraph ───────────────────────────────────

function ParagraphEditor({
  data,
  onChange,
}: {
  data: ParagraphData;
  onChange: (u: Partial<ParagraphData>) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Min Length</Label>
          <Input
            type="number"
            value={data.minLength ?? 0}
            onChange={(e) => onChange({ minLength: Number(e.target.value) })}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Max Length</Label>
          <Input
            type="number"
            value={data.maxLength ?? 5000}
            onChange={(e) => onChange({ maxLength: Number(e.target.value) })}
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label>Model Answer</Label>
        <Textarea
          value={data.modelAnswer ?? ""}
          onChange={(e) => onChange({ modelAnswer: e.target.value || undefined })}
          rows={3}
          className="mt-1"
        />
      </div>
      <div>
        <Label>Evaluation Guidance (for AI)</Label>
        <Textarea
          value={data.evaluationGuidance ?? ""}
          onChange={(e) =>
            onChange({ evaluationGuidance: e.target.value || undefined })
          }
          rows={2}
          className="mt-1"
        />
      </div>
    </div>
  );
}

// ── Code ────────────────────────────────────────

function CodeEditor({
  data,
  onChange,
}: {
  data: CodeData;
  onChange: (u: Partial<CodeData>) => void;
}) {
  const testCases: CodeTestCase[] = data.testCases ?? [];

  const addTestCase = () => {
    onChange({
      testCases: [
        ...testCases,
        { id: `tc_${Date.now()}`, input: "", expectedOutput: "" },
      ],
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label>Language</Label>
          <Select value={data.language} onValueChange={(v) => onChange({ language: v })}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["python", "javascript", "java", "cpp", "c", "go", "rust"].map(
                (l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Timeout (ms)</Label>
          <Input
            type="number"
            value={data.timeoutMs ?? 5000}
            onChange={(e) => onChange({ timeoutMs: Number(e.target.value) })}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Memory Limit (MB)</Label>
          <Input
            type="number"
            value={data.memoryLimitMb ?? 256}
            onChange={(e) => onChange({ memoryLimitMb: Number(e.target.value) })}
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label>Starter Code</Label>
        <Textarea
          value={data.starterCode ?? ""}
          onChange={(e) => onChange({ starterCode: e.target.value || undefined })}
          rows={4}
          className="mt-1 font-mono"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Test Cases</Label>
          <Button variant="outline" size="sm" onClick={addTestCase}>
            <Plus className="h-3 w-3" /> Add
          </Button>
        </div>
        {testCases.map((tc, idx) => (
          <div key={tc.id} className="flex gap-2 items-start">
            <Textarea
              value={tc.input}
              onChange={(e) => {
                const updated = [...testCases];
                updated[idx] = { ...tc, input: e.target.value };
                onChange({ testCases: updated });
              }}
              placeholder="Input"
              rows={1}
              className="flex-1 font-mono text-xs"
            />
            <Textarea
              value={tc.expectedOutput}
              onChange={(e) => {
                const updated = [...testCases];
                updated[idx] = { ...tc, expectedOutput: e.target.value };
                onChange({ testCases: updated });
              }}
              placeholder="Expected Output"
              rows={1}
              className="flex-1 font-mono text-xs"
            />
            <div className="flex items-center gap-1">
              <Switch
                checked={tc.isHidden ?? false}
                onCheckedChange={(v) => {
                  const updated = [...testCases];
                  updated[idx] = { ...tc, isHidden: v };
                  onChange({ testCases: updated });
                }}
                id={`hidden-${tc.id}`}
              />
              <Label htmlFor={`hidden-${tc.id}`} className="cursor-pointer text-xs">Hidden</Label>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                onChange({ testCases: testCases.filter((_, i) => i !== idx) })
              }
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              aria-label="Remove test case"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Fill in the Blanks ──────────────────────────

function FillBlanksEditor({
  data,
  onChange,
}: {
  data: FillBlanksData;
  onChange: (u: Partial<FillBlanksData>) => void;
}) {
  const blanks: FillBlank[] = data.blanks ?? [];

  const addBlank = () => {
    onChange({
      blanks: [
        ...blanks,
        { id: `blank_${Date.now()}`, correctAnswer: "" },
      ],
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>
          Text with Blanks (use ___1___, ___2___ etc.)
        </Label>
        <Textarea
          value={data.textWithBlanks}
          onChange={(e) => onChange({ textWithBlanks: e.target.value })}
          rows={3}
          className="mt-1"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Blanks</Label>
          <Button variant="outline" size="sm" onClick={addBlank}>
            <Plus className="h-3 w-3" /> Add
          </Button>
        </div>
        {blanks.map((b, idx) => (
          <div key={b.id} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-8">#{idx + 1}</span>
            <Input
              type="text"
              value={b.correctAnswer}
              onChange={(e) => {
                const updated = [...blanks];
                updated[idx] = { ...b, correctAnswer: e.target.value };
                onChange({ blanks: updated });
              }}
              placeholder="Correct answer"
              className="h-8 flex-1"
            />
            <Button variant="ghost" size="icon" onClick={() => onChange({ blanks: blanks.filter((_, i) => i !== idx) })} className="h-8 w-8 text-muted-foreground hover:text-destructive" aria-label="Remove blank">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Fill Blanks Dropdown ────────────────────────

function FillBlanksDDEditor({
  data,
  onChange,
}: {
  data: FillBlanksDDData;
  onChange: (u: Partial<FillBlanksDDData>) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Text with Blanks</Label>
        <Textarea
          value={data.textWithBlanks}
          onChange={(e) => onChange({ textWithBlanks: e.target.value })}
          rows={3}
          className="mt-1"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Dropdown blanks are configured per-blank with options and a correct option ID.
        Add blanks, then configure each with their options.
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const blanks = [...(data.blanks ?? [])];
          blanks.push({
            id: `ddb_${Date.now()}`,
            correctOptionId: "",
            options: [{ id: `ddo_${Date.now()}`, text: "" }],
          });
          onChange({ blanks });
        }}
      >
        <Plus className="h-3 w-3" /> Add Blank
      </Button>
      {(data.blanks ?? []).map((blank, bIdx) => (
        <div key={blank.id} className="rounded border p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Blank #{bIdx + 1}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                onChange({
                  blanks: (data.blanks ?? []).filter((_, i) => i !== bIdx),
                })
              }
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              aria-label="Remove blank"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          {blank.options.map((opt, oIdx) => (
            <div key={opt.id} className="flex items-center gap-2">
              <input
                type="radio"
                checked={blank.correctOptionId === opt.id}
                onChange={() => {
                  const blanks = [...(data.blanks ?? [])];
                  blanks[bIdx] = { ...blank, correctOptionId: opt.id };
                  onChange({ blanks });
                }}
              />
              <Input
                type="text"
                value={opt.text}
                onChange={(e) => {
                  const blanks = [...(data.blanks ?? [])];
                  const options = [...blank.options];
                  options[oIdx] = { ...opt, text: e.target.value };
                  blanks[bIdx] = { ...blank, options };
                  onChange({ blanks });
                }}
                className="h-7 flex-1 text-xs"
              />
            </div>
          ))}
          <button
            onClick={() => {
              const blanks = [...(data.blanks ?? [])];
              blanks[bIdx] = {
                ...blank,
                options: [
                  ...blank.options,
                  { id: `ddo_${Date.now()}`, text: "" },
                ],
              };
              onChange({ blanks });
            }}
            className="text-xs text-primary hover:underline"
          >
            + Add option
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Matching ────────────────────────────────────

function MatchingEditor({
  data,
  onChange,
}: {
  data: MatchingData;
  onChange: (u: Partial<MatchingData>) => void;
}) {
  const pairs: MatchingPair[] = data.pairs ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Switch
          checked={data.shufflePairs ?? false}
          onCheckedChange={(v) => onChange({ shufflePairs: v })}
          id="shuffle-pairs"
        />
        <Label htmlFor="shuffle-pairs" className="cursor-pointer text-sm">Shuffle pairs</Label>
      </div>
      {pairs.map((pair, idx) => (
        <div key={pair.id} className="flex items-center gap-2">
          <Input
            type="text"
            value={pair.left}
            onChange={(e) => {
              const updated = [...pairs];
              updated[idx] = { ...pair, left: e.target.value };
              onChange({ pairs: updated });
            }}
            placeholder="Left"
            className="h-8 flex-1"
          />
          <span className="text-muted-foreground">→</span>
          <Input
            type="text"
            value={pair.right}
            onChange={(e) => {
              const updated = [...pairs];
              updated[idx] = { ...pair, right: e.target.value };
              onChange({ pairs: updated });
            }}
            placeholder="Right"
            className="h-8 flex-1"
          />
          <Button variant="ghost" size="icon" onClick={() => onChange({ pairs: pairs.filter((_, i) => i !== idx) })} className="h-8 w-8 text-muted-foreground hover:text-destructive" aria-label="Remove pair">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          onChange({
            pairs: [
              ...pairs,
              { id: `pair_${Date.now()}`, left: "", right: "" },
            ],
          })
        }
      >
        <Plus className="h-3 w-3" /> Add Pair
      </Button>
    </div>
  );
}

// ── Jumbled / Ordering ──────────────────────────

function JumbledEditor({
  data,
  onChange,
}: {
  data: JumbledData;
  onChange: (u: Partial<JumbledData>) => void;
}) {
  const items: JumbledItem[] = data.items ?? [];

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Add items in the correct order. Students will see them shuffled.
      </p>
      {items.map((item, idx) => (
        <div key={item.id} className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-6">{idx + 1}.</span>
          <Input
            type="text"
            value={item.text}
            onChange={(e) => {
              const updated = [...items];
              updated[idx] = { ...item, text: e.target.value };
              onChange({
                items: updated,
                correctOrder: updated.map((i) => i.id),
              });
            }}
            className="h-8 flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const updated = items.filter((_, i) => i !== idx);
              onChange({
                items: updated,
                correctOrder: updated.map((i) => i.id),
              });
            }}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            aria-label="Remove item"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const newItem = { id: `jmb_${Date.now()}`, text: "" };
          const updated = [...items, newItem];
          onChange({
            items: updated,
            correctOrder: updated.map((i) => i.id),
          });
        }}
      >
        <Plus className="h-3 w-3" /> Add Item
      </Button>
    </div>
  );
}

// ── Audio ───────────────────────────────────────

function AudioEditor({
  data,
  onChange,
}: {
  data: AudioData;
  onChange: (u: Partial<AudioData>) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label>Max Duration (seconds)</Label>
        <Input
          type="number"
          value={data.maxDurationSeconds ?? 120}
          onChange={(e) =>
            onChange({ maxDurationSeconds: Number(e.target.value) })
          }
          className="mt-1"
        />
      </div>
      <div>
        <Label>Language</Label>
        <Input
          type="text"
          value={data.language ?? ""}
          onChange={(e) => onChange({ language: e.target.value || undefined })}
          placeholder="e.g. en, hi"
          className="mt-1"
        />
      </div>
      <div className="sm:col-span-2">
        <Label>Evaluation Guidance</Label>
        <Textarea
          value={data.evaluationGuidance ?? ""}
          onChange={(e) =>
            onChange({ evaluationGuidance: e.target.value || undefined })
          }
          rows={2}
          className="mt-1"
        />
      </div>
    </div>
  );
}

// ── Image Evaluation ────────────────────────────

function ImageEvalEditor({
  data,
  onChange,
}: {
  data: ImageEvaluationData;
  onChange: (u: Partial<ImageEvaluationData>) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Instructions</Label>
        <Textarea
          value={data.instructions}
          onChange={(e) => onChange({ instructions: e.target.value })}
          rows={3}
          className="mt-1"
        />
      </div>
      <div>
        <Label>Max Images</Label>
        <Input
          type="number"
          value={data.maxImages ?? 1}
          onChange={(e) => onChange({ maxImages: Number(e.target.value) })}
          min={1}
          className="mt-1 w-32"
        />
      </div>
      <div>
        <Label>Evaluation Guidance</Label>
        <Textarea
          value={data.evaluationGuidance ?? ""}
          onChange={(e) =>
            onChange({ evaluationGuidance: e.target.value || undefined })
          }
          rows={2}
          className="mt-1"
        />
      </div>
    </div>
  );
}

// ── Group Options ───────────────────────────────

function GroupOptionsEditor({
  data,
  onChange,
}: {
  data: GroupOptionsData;
  onChange: (u: Partial<GroupOptionsData>) => void;
}) {
  const groups: GroupOptionsGroup[] = data.groups ?? [];
  const goItems: GOItem[] = data.items ?? [];

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <Label>Groups</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onChange({
                groups: [
                  ...groups,
                  {
                    id: `grp_${Date.now()}`,
                    name: `Group ${groups.length + 1}`,
                    correctItems: [],
                  },
                ],
              })
            }
          >
            <Plus className="h-3 w-3" /> Add Group
          </Button>
        </div>
        {groups.map((g, idx) => (
          <div key={g.id} className="mt-2 flex items-center gap-2">
            <Input
              type="text"
              value={g.name}
              onChange={(e) => {
                const updated = [...groups];
                updated[idx] = { ...g, name: e.target.value };
                onChange({ groups: updated });
              }}
              className="h-8 flex-1"
            />
            <Button variant="ghost" size="icon" onClick={() => onChange({ groups: groups.filter((_, i) => i !== idx) })} className="h-8 w-8 text-muted-foreground hover:text-destructive" aria-label="Remove group">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center justify-between">
          <Label>Items</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onChange({
                items: [
                  ...goItems,
                  { id: `gi_${Date.now()}`, text: "" },
                ],
              })
            }
          >
            <Plus className="h-3 w-3" /> Add Item
          </Button>
        </div>
        {goItems.map((item, idx) => (
          <div key={item.id} className="mt-2 flex items-center gap-2">
            <Input
              type="text"
              value={item.text}
              onChange={(e) => {
                const updated = [...goItems];
                updated[idx] = { ...item, text: e.target.value };
                onChange({ items: updated });
              }}
              className="h-8 flex-1"
            />
            <Select
              value={
                groups.find((g) => g.correctItems.includes(item.id))?.id ?? "unassigned"
              }
              onValueChange={(v) => {
                const targetGroupId = v === "unassigned" ? "" : v;
                const updatedGroups = groups.map((g) => ({
                  ...g,
                  correctItems: g.id === targetGroupId
                    ? [...g.correctItems.filter((id) => id !== item.id), item.id]
                    : g.correctItems.filter((id) => id !== item.id),
                }));
                onChange({ groups: updatedGroups });
              }}
            >
              <SelectTrigger className="h-8 w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {groups.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={() => onChange({ items: goItems.filter((_, i) => i !== idx) })} className="h-8 w-8 text-muted-foreground hover:text-destructive" aria-label="Remove item">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Chat Agent ──────────────────────────────────

function ChatAgentEditor({
  data,
  onChange,
}: {
  data: ChatAgentQuestionData;
  onChange: (u: Partial<ChatAgentQuestionData>) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Agent ID (optional)</Label>
        <Input
          type="text"
          value={data.agentId ?? ""}
          onChange={(e) => onChange({ agentId: e.target.value || undefined })}
          className="mt-1"
        />
      </div>
      <div>
        <Label>Objectives (one per line)</Label>
        <Textarea
          value={data.objectives?.join("\n") ?? ""}
          onChange={(e) =>
            onChange({ objectives: e.target.value.split("\n").filter(Boolean) })
          }
          rows={3}
          className="mt-1"
        />
      </div>
      <div>
        <Label>
          Conversation Starters (one per line)
        </Label>
        <Textarea
          value={data.conversationStarters?.join("\n") ?? ""}
          onChange={(e) =>
            onChange({
              conversationStarters: e.target.value
                .split("\n")
                .filter(Boolean),
            })
          }
          rows={2}
          className="mt-1"
        />
      </div>
      <div>
        <Label>Max Turns</Label>
        <Input
          type="number"
          value={data.maxTurns ?? 10}
          onChange={(e) => onChange({ maxTurns: Number(e.target.value) })}
          min={1}
          className="mt-1 w-32"
        />
      </div>
      <div>
        <Label>Evaluation Guidance</Label>
        <Textarea
          value={data.evaluationGuidance ?? ""}
          onChange={(e) =>
            onChange({ evaluationGuidance: e.target.value || undefined })
          }
          rows={2}
          className="mt-1"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
// Material Data Editor (all 7 types)
// ─────────────────────────────────────────────────

function MaterialDataEditor({
  materialType,
  data,
  onChange,
}: {
  materialType: MaterialType;
  data: MaterialPayload;
  onChange: (updates: Partial<MaterialPayload>) => void;
}) {
  switch (materialType) {
    case "text":
      return (
        <div>
          <Label>Text Content</Label>
          <Textarea
            value={data.content ?? ""}
            onChange={(e) => onChange({ content: e.target.value })}
            rows={8}
            className="mt-1"
          />
        </div>
      );
    case "video":
      return (
        <div className="space-y-3">
          <div>
            <Label>Video URL</Label>
            <Input
              type="url"
              value={data.url ?? ""}
              onChange={(e) => onChange({ url: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
              className="mt-1"
            />
          </div>
          <div>
            <Label>Duration (seconds)</Label>
            <Input
              type="number"
              value={data.duration ?? 0}
              onChange={(e) => onChange({ duration: Number(e.target.value) })}
              className="mt-1 w-32"
            />
          </div>
        </div>
      );
    case "pdf":
      return (
        <div className="space-y-3">
          <div>
            <Label>PDF URL</Label>
            <Input
              type="url"
              value={data.url ?? ""}
              onChange={(e) => onChange({ url: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={data.downloadable ?? false}
              onCheckedChange={(v) => onChange({ downloadable: v })}
              id="allow-download"
            />
            <Label htmlFor="allow-download" className="cursor-pointer text-sm">Allow download</Label>
          </div>
        </div>
      );
    case "link":
      return (
        <div>
          <Label>URL</Label>
          <Input
            type="url"
            value={data.url ?? ""}
            onChange={(e) => onChange({ url: e.target.value })}
            placeholder="https://..."
            className="mt-1"
          />
        </div>
      );
    case "interactive":
    case "story":
      return (
        <div className="space-y-3">
          <div>
            <Label>URL</Label>
            <Input
              type="url"
              value={data.url ?? ""}
              onChange={(e) => onChange({ url: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Content</Label>
            <Textarea
              value={data.content ?? ""}
              onChange={(e) => onChange({ content: e.target.value })}
              rows={4}
              className="mt-1"
            />
          </div>
        </div>
      );
    case "rich":
      return (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Rich content is composed of blocks. Edit the JSON below or use individual block editors.
          </p>
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              value={data.richContent?.title ?? ""}
              onChange={(e) =>
                onChange({
                  richContent: {
                    ...(data.richContent ?? { blocks: [] }),
                    title: e.target.value || undefined,
                  },
                })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label>Content (markdown)</Label>
            <Textarea
              value={data.content ?? ""}
              onChange={(e) => onChange({ content: e.target.value })}
              rows={6}
              className="mt-1"
            />
          </div>
        </div>
      );
    default:
      return (
        <p className="text-sm text-muted-foreground">
          No specific editor for this material type
        </p>
      );
  }
}
