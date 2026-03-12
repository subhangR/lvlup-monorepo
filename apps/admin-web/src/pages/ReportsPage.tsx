import { useState } from "react";
import { useCurrentTenantId } from "@levelup/shared-stores";
import { useExams, useClasses } from "@levelup/shared-hooks";
import { callGenerateReport } from "@levelup/shared-services";
import {
  DownloadPDFButton,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  CardContent,
} from "@levelup/shared-ui";
import { FileText, Users } from "lucide-react";

export default function ReportsPage() {
  const tenantId = useCurrentTenantId();
  const { data: exams = [] } = useExams(tenantId);
  const { data: classes = [] } = useClasses(tenantId);
  const [activeTab, setActiveTab] = useState<"exams" | "classes">("exams");

  const publishedExams = exams.filter(
    (e) =>
      e.status === "grading" ||
      e.status === "completed" ||
      e.status === "results_released",
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Generate and download PDF reports for exams and classes
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "exams" | "classes")}>
        <TabsList>
          <TabsTrigger value="exams">Exam Reports</TabsTrigger>
          <TabsTrigger value="classes">Class Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="exams">
          <div className="space-y-3">
            {publishedExams.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No exams with results available yet
                </p>
              </div>
            ) : (
              publishedExams.map((exam) => (
                <Card key={exam.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-medium">{exam.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {exam.subject} &middot; {exam.totalMarks} marks &middot;{" "}
                        {exam.status.replace(/_/g, " ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {tenantId && (
                        <DownloadPDFButton
                          onGenerate={async () => {
                            const res = await callGenerateReport({
                              tenantId: tenantId!,
                              type: 'exam-result',
                              examId: exam.id,
                            });
                            return { downloadUrl: res.pdfUrl };
                          }}
                          label="Class Summary PDF"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="classes">
          <div className="space-y-3">
            {classes.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
                <Users className="h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No classes found
                </p>
              </div>
            ) : (
              classes.map((cls) => (
                <Card key={cls.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-medium">{cls.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {[cls.grade, cls.section].filter(Boolean).join(" - ") ||
                          cls.id}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {tenantId && (
                        <DownloadPDFButton
                          onGenerate={async () => {
                            const res = await callGenerateReport({
                              tenantId: tenantId!,
                              type: 'class',
                              classId: cls.id,
                            });
                            return { downloadUrl: res.pdfUrl };
                          }}
                          label="Class Report PDF"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
