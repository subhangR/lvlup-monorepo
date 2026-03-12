import { useState } from 'react';
import { useAuthStore } from '@levelup/shared-stores';
import { useSpaces, useProgress, useStudentProgressSummary } from '@levelup/shared-hooks';
import { Link } from 'react-router-dom';
import ProgressBar from '../components/common/ProgressBar';
import {
  Skeleton,
  ProgressRing,
  ScoreCard,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@levelup/shared-ui';
import { BarChart3, BookOpen, Award, ClipboardList, Target } from 'lucide-react';
import type { Space } from '@levelup/shared-types';

type TabId = 'overall' | 'exams' | 'spaces';

export default function ProgressPage() {
  const { currentTenantId, user, currentMembership } = useAuthStore();
  const userId = user?.uid ?? null;
  const classIds = currentMembership?.permissions?.managedClassIds;
  const { data: spaces, isLoading } = useSpaces(currentTenantId, { status: 'published', classIds });
  const { data: summary } = useStudentProgressSummary(currentTenantId, userId);
  const [activeTab, setActiveTab] = useState<TabId>('overall');

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Progress</h1>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">My Progress</h1>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)}>
        <TabsList>
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="spaces">Spaces</TabsTrigger>
        </TabsList>

        {/* Overall Tab */}
        <TabsContent value="overall">
          <div className="space-y-6">
            {summary ? (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  <ScoreCard
                    label="Overall Score"
                    value={`${Math.round(summary.overallScore * 100)}%`}
                    icon={Target}
                  />
                  <ScoreCard
                    label="Avg Exam Score"
                    value={`${Math.round(summary.autograde.averagePercentage)}%`}
                    icon={ClipboardList}
                  />
                  <ScoreCard
                    label="Space Completion"
                    value={`${Math.round(summary.levelup.averageCompletion)}%`}
                    icon={BookOpen}
                  />
                </div>

                {/* Subject breakdown */}
                {Object.keys(summary.autograde.subjectBreakdown).length > 0 && (
                  <div className="rounded-lg border bg-card p-5">
                    <h3 className="font-semibold text-sm mb-3">Exam Performance by Subject</h3>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {Object.entries(summary.autograde.subjectBreakdown).map(
                        ([subject, data]) => (
                          <div
                            key={subject}
                            className="flex items-center gap-3 rounded-md border p-3"
                          >
                            <ProgressRing
                              value={data.avgScore * 100}
                              size={50}
                              strokeWidth={5}
                            />
                            <div>
                              <p className="text-sm font-medium">{subject}</p>
                              <p className="text-xs text-muted-foreground">
                                {data.examCount} exam{data.examCount !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                No overall progress data yet. Complete exams and spaces to see your combined metrics.
              </p>
            )}
          </div>
        </TabsContent>

        {/* Exams Tab */}
        <TabsContent value="exams">
          <div className="space-y-4">
            {summary?.autograde.recentExams.length ? (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summary.autograde.recentExams.map((exam) => (
                      <TableRow key={exam.examId}>
                        <TableCell className="font-medium">{exam.examTitle}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {exam.score.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-medium ${
                              exam.percentage >= 70
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : exam.percentage >= 40
                                  ? 'text-yellow-600 dark:text-yellow-400'
                                  : 'text-destructive'
                            }`}
                          >
                            {Math.round(exam.percentage)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No exam results yet.</p>
            )}
          </div>
        </TabsContent>

        {/* Spaces Tab */}
        <TabsContent value="spaces">
          <div className="space-y-4">
            {!spaces?.length ? (
              <p className="text-muted-foreground">No spaces to track.</p>
            ) : (
              spaces.map((space) => (
                <SpaceProgressCard
                  key={space.id}
                  space={space}
                  tenantId={currentTenantId!}
                  userId={userId!}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SpaceProgressCard({
  space,
  tenantId,
  userId,
}: {
  space: Space;
  tenantId: string;
  userId: string;
}) {
  const { data: progress } = useProgress(tenantId, userId, space.id);

  const percentage = progress?.percentage ?? 0;
  const pointsEarned = progress?.pointsEarned ?? 0;
  const totalPoints = progress?.totalPoints ?? 0;
  const status = progress?.status ?? 'not_started';
  const spCount = Object.keys(progress?.storyPoints ?? {}).length;
  const completedSPs = Object.values(progress?.storyPoints ?? {}).filter(
    (sp) => sp.status === 'completed',
  ).length;

  return (
    <Link
      to={`/spaces/${space.id}`}
      className="block rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">{space.title}</h3>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            status === 'completed'
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              : status === 'in_progress'
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground'
          }`}
        >
          {status === 'not_started' ? 'Not Started' : status === 'in_progress' ? 'In Progress' : 'Completed'}
        </span>
      </div>

      <ProgressBar value={percentage} color={status === 'completed' ? 'green' : 'blue'} />

      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Award className="h-3 w-3" /> {pointsEarned}/{totalPoints} pts
        </span>
        <span className="flex items-center gap-1">
          <BookOpen className="h-3 w-3" /> {completedSPs}/{spCount} sections
        </span>
      </div>
    </Link>
  );
}
