import { useState, useRef, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCurrentTenantId, useAuthStore } from "@levelup/shared-stores";
import { useExam, useSubmissions } from "@levelup/shared-hooks";
import {
  doc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { getFirebaseServices, callUploadAnswerSheets } from "@levelup/shared-services";
import type { Submission } from "@levelup/shared-types";
import {
  ArrowLeft,
  Upload,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Send,
  FileCheck,
  BarChart3,
  Users,
  Download,
} from "lucide-react";
import {
  Button,
  Input,
  Label,
  Badge,
  Card,
  CardContent,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@levelup/shared-ui";

const PIPELINE_ICONS: Record<string, React.ElementType> = {
  uploaded: Clock,
  ocr_processing: Loader2,
  scouting: Loader2,
  scouting_complete: CheckCircle2,
  grading: Loader2,
  grading_partial: Clock,
  grading_complete: CheckCircle2,
  ready_for_review: Eye,
  reviewed: CheckCircle2,
  failed: AlertCircle,
  manual_review_needed: AlertCircle,
};

const PIPELINE_COLORS: Record<string, string> = {
  uploaded: "text-blue-500",
  ocr_processing: "text-blue-500 animate-spin",
  scouting: "text-blue-500 animate-spin",
  scouting_complete: "text-green-500",
  grading: "text-purple-500 animate-spin",
  grading_partial: "text-purple-500",
  grading_complete: "text-green-500",
  ready_for_review: "text-orange-500",
  reviewed: "text-green-600",
  failed: "text-red-500",
  manual_review_needed: "text-red-500",
};

export default function SubmissionsPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const tenantId = useCurrentTenantId();
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const { data: exam } = useExam(tenantId, examId ?? null);
  const { data: submissions = [], refetch } = useSubmissions(tenantId, { examId });
  const [uploading, setUploading] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [classId, setClassId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleUploadSubmission = async () => {
    if (!tenantId || !examId || !firebaseUser) return;
    if (selectedFiles.length === 0) return;

    setUploading(true);
    try {
      const { storage } = getFirebaseServices();
      const storagePaths: string[] = [];
      for (const file of selectedFiles) {
        const path = `tenants/${tenantId}/submissions/${examId}/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        storagePaths.push(path);
      }

      await callUploadAnswerSheets({
        tenantId,
        examId,
        studentId: studentName || "Unknown",
        classId: classId || "",
        imageUrls: storagePaths,
      });

      setStudentName("");
      setRollNumber("");
      setClassId("");
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      refetch();
    } finally {
      setUploading(false);
    }
  };

  const handleReleaseResults = async (submissionIds: string[]) => {
    if (!tenantId) return;
    const { db } = getFirebaseServices();
    const batch = writeBatch(db);
    for (const id of submissionIds) {
      batch.update(doc(db, `tenants/${tenantId}/submissions`, id), {
        resultsReleased: true,
        resultsReleasedAt: serverTimestamp(),
        resultsReleasedBy: firebaseUser?.uid,
        updatedAt: serverTimestamp(),
      });
    }
    await batch.commit();
    refetch();
  };

  const handleExportCSV = () => {
    if (submissions.length === 0) return;

    // Build CSV header
    const headers = [
      "Student Name",
      "Roll Number",
      "Class",
      "Pipeline Status",
      "Total Score",
      "Max Score",
      "Percentage",
      "Grade",
    ];

    // Build rows
    const rows = submissions.map((sub) => [
      sub.studentName ?? "",
      sub.rollNumber ?? "",
      sub.classId ?? "",
      sub.pipelineStatus.replace(/_/g, " "),
      sub.summary?.totalScore?.toString() ?? "",
      sub.summary?.maxScore?.toString() ?? "",
      sub.summary?.percentage != null ? Math.round(sub.summary.percentage).toString() : "",
      sub.summary?.grade ?? "",
    ]);

    // Escape CSV values
    const escapeCsv = (val: string) => {
      if (val.includes(",") || val.includes('"') || val.includes("\n")) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const csv = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${exam?.title ?? "exam"}-results.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reviewedSubs = submissions.filter(
    (s) => s.pipelineStatus === "reviewed" || s.pipelineStatus === "grading_complete"
  );
  const unreleasedReviewed = reviewedSubs.filter((s) => !s.resultsReleased);

  // Summary stats
  const stats = useMemo(() => {
    const total = submissions.length;
    const graded = submissions.filter((s) =>
      ["grading_complete", "ready_for_review", "reviewed"].includes(s.pipelineStatus)
    ).length;
    const needsReview = submissions.filter((s) =>
      ["ready_for_review", "manual_review_needed", "grading_partial"].includes(s.pipelineStatus)
    ).length;
    const inProgress = submissions.filter((s) =>
      ["uploaded", "ocr_processing", "scouting", "scouting_complete", "grading"].includes(s.pipelineStatus)
    ).length;
    const scores = submissions
      .filter((s) => s.summary?.percentage != null)
      .map((s) => s.summary!.percentage);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
    return { total, graded, needsReview, inProgress, avgScore };
  }, [submissions]);

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to="/exams">Exams</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/exams/${examId}`}>{exam?.title ?? "Exam"}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Submissions</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/exams/${examId}`)} aria-label="Go back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Submissions</h1>
          <p className="text-sm text-muted-foreground">
            {exam?.title} &middot; {submissions.length} submissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          {submissions.length > 0 && (
            <Button onClick={handleExportCSV} variant="outline" size="sm">
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
          )}
          {unreleasedReviewed.length > 0 && (
            <Button
              onClick={() =>
                handleReleaseResults(unreleasedReviewed.map((s) => s.id))
              }
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="h-3.5 w-3.5" /> Release All Results (
              {unreleasedReviewed.length})
            </Button>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      {submissions.length > 0 && (
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="p-3 text-center">
              <Users className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
              <p className="text-lg font-bold">{stats.total}</p>
              <p className="text-[10px] text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <FileCheck className="h-4 w-4 mx-auto text-green-500 mb-1" />
              <p className="text-lg font-bold">{stats.graded}</p>
              <p className="text-[10px] text-muted-foreground">Graded</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <Loader2 className="h-4 w-4 mx-auto text-blue-500 mb-1" />
              <p className="text-lg font-bold">{stats.inProgress}</p>
              <p className="text-[10px] text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <Eye className="h-4 w-4 mx-auto text-amber-500 mb-1" />
              <p className="text-lg font-bold">{stats.needsReview}</p>
              <p className="text-[10px] text-muted-foreground">Needs Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <BarChart3 className="h-4 w-4 mx-auto text-primary mb-1" />
              <p className="text-lg font-bold">{stats.avgScore != null ? `${stats.avgScore}%` : "—"}</p>
              <p className="text-[10px] text-muted-foreground">Avg Score</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upload new submission */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <h3 className="font-medium">Upload Answer Sheet</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label className="text-xs">Student Name</Label>
              <Input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="mt-1 h-8"
              />
            </div>
            <div>
              <Label className="text-xs">Roll Number</Label>
              <Input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="mt-1 h-8"
              />
            </div>
            <div>
              <Label className="text-xs">Class ID</Label>
              <Input
                type="text"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="mt-1 h-8"
              />
            </div>
          </div>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const droppedFiles = Array.from(e.dataTransfer.files);
              setSelectedFiles(droppedFiles);
              // Update the file input programmatically isn't possible but track state
            }}
            className="cursor-pointer rounded-lg border-2 border-dashed p-6 text-center hover:border-primary hover:bg-muted/50 transition-colors"
          >
            <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="mt-1 text-sm font-medium">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">PDF or image files</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={(e) => setSelectedFiles(Array.from(e.target.files ?? []))}
              className="hidden"
            />
          </div>
          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((f, i) => (
                <Badge key={i} variant="secondary">{f.name}</Badge>
              ))}
            </div>
          )}
          <Button
            onClick={handleUploadSubmission}
            disabled={uploading || selectedFiles.length === 0}
            size="sm"
          >
            {uploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5" /> Upload
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Submission list */}
      <div className="space-y-2">
        {submissions.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No submissions yet. Upload answer sheets above.
          </p>
        ) : (
          submissions.map((sub: Submission) => {
            const StatusIcon =
              PIPELINE_ICONS[sub.pipelineStatus] ?? Clock;
            const statusColor =
              PIPELINE_COLORS[sub.pipelineStatus] ?? "text-gray-500";

            return (
              <Link
                key={sub.id}
                to={`/exams/${examId}/submissions/${sub.id}`}
                className="block rounded-lg border bg-card hover:shadow-sm transition-shadow overflow-hidden"
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`h-5 w-5 ${statusColor}`} />
                    <div>
                      <p className="text-sm font-medium">{sub.studentName}</p>
                      <p className="text-xs text-muted-foreground">
                        Roll: {sub.rollNumber}
                        {sub.classId && ` | Class: ${sub.classId}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground capitalize">
                      {sub.pipelineStatus.replace(/_/g, " ")}
                    </span>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {sub.summary?.totalScore ?? "-"}/
                        {sub.summary?.maxScore ?? exam?.totalMarks ?? "-"}
                      </p>
                      {sub.summary?.percentage != null && (
                        <p className="text-xs text-muted-foreground">
                          {Math.round(sub.summary.percentage)}%{" "}
                          {sub.summary.grade && `(${sub.summary.grade})`}
                        </p>
                      )}
                    </div>
                    {sub.resultsReleased && (
                      <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:text-green-400">
                        Released
                      </span>
                    )}
                  </div>
                </div>
                {/* Pipeline progress bar for active grading */}
                {sub.pipelineStatus === "grading" && (sub as Submission & { gradingProgress?: { percentComplete?: number } }).gradingProgress?.percentComplete != null && (
                  <div className="px-4 pb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-muted-foreground">Grading in progress</span>
                      <span className="text-[10px] font-medium text-purple-600 dark:text-purple-400">
                        {(sub as Submission & { gradingProgress?: { percentComplete?: number } }).gradingProgress!.percentComplete}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-purple-500 transition-all duration-500"
                        style={{ width: `${(sub as Submission & { gradingProgress?: { percentComplete?: number } }).gradingProgress!.percentComplete}%` }}
                      />
                    </div>
                  </div>
                )}
                {/* Pipeline step indicator for non-terminal states */}
                {["uploaded", "ocr_processing", "scouting", "scouting_complete", "grading"].includes(sub.pipelineStatus) && (
                  <div className="px-4 pb-3">
                    <PipelineSteps status={sub.pipelineStatus} />
                  </div>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

const PIPELINE_STEP_ORDER = ["uploaded", "scouting", "grading", "review"] as const;
const PIPELINE_STEP_LABELS: Record<string, string> = {
  uploaded: "Upload",
  scouting: "Mapping",
  grading: "Grading",
  review: "Review",
};

function pipelineStepIndex(status: string): number {
  if (status === "uploaded") return 0;
  if (status === "ocr_processing" || status === "scouting") return 1;
  if (status === "scouting_complete" || status === "grading") return 2;
  return 3;
}

function PipelineSteps({ status }: { status: string }) {
  const currentIdx = pipelineStepIndex(status);

  return (
    <div className="flex items-center gap-1">
      {PIPELINE_STEP_ORDER.map((step, idx) => {
        const isComplete = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        return (
          <div key={step} className="flex items-center gap-1 flex-1">
            <div
              className={`h-1 flex-1 rounded-full transition-colors ${
                isComplete
                  ? "bg-green-500"
                  : isCurrent
                    ? "bg-primary animate-pulse"
                    : "bg-muted"
              }`}
            />
            <span
              className={`text-[9px] whitespace-nowrap ${
                isComplete
                  ? "text-green-600 dark:text-green-400"
                  : isCurrent
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
              }`}
            >
              {PIPELINE_STEP_LABELS[step]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
