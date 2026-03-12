import { Link } from 'react-router-dom';
import { useStudentInsights, useDismissInsight } from '@levelup/shared-hooks';
import type { LearningInsight } from '@levelup/shared-types';
import {
  Lightbulb,
  BookOpen,
  Flame,
  Trophy,
  AlertTriangle,
  TrendingUp,
  X,
} from 'lucide-react';

const INSIGHT_CONFIG: Record<
  string,
  { icon: typeof Lightbulb; color: string; bg: string }
> = {
  weak_topic_recommendation: { icon: Lightbulb, color: 'text-orange-600', bg: 'bg-orange-50' },
  exam_preparation: { icon: BookOpen, color: 'text-primary', bg: 'bg-primary/10' },
  streak_encouragement: { icon: Flame, color: 'text-destructive', bg: 'bg-destructive/10' },
  improvement_celebration: { icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  at_risk_intervention: { icon: AlertTriangle, color: 'text-purple-600', bg: 'bg-purple-50' },
  cross_system_correlation: { icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
};

function InsightCard({
  insight,
  onDismiss,
}: {
  insight: LearningInsight;
  onDismiss: (id: string) => void;
}) {
  const config = INSIGHT_CONFIG[insight.type] ?? INSIGHT_CONFIG.weak_topic_recommendation;
  const Icon = config.icon;

  const actionHref =
    insight.actionType === 'practice_space' && insight.actionEntityId
      ? `/spaces/${insight.actionEntityId}`
      : insight.actionType === 'review_exam' && insight.actionEntityId
        ? `/exams/${insight.actionEntityId}/results`
        : undefined;

  return (
    <div className={`rounded-lg border p-4 ${config.bg}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${config.color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium">{insight.title}</h4>
            <button
              onClick={() => onDismiss(insight.id)}
              className="flex-shrink-0 rounded p-0.5 hover:bg-black/5"
              title="Dismiss"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{insight.description}</p>
          {actionHref && (
            <Link
              to={actionHref}
              className="mt-2 inline-flex items-center gap-1 rounded-md bg-background/80 border px-2.5 py-1 text-xs font-medium hover:bg-background"
            >
              {insight.actionType === 'practice_space' ? 'Start Practicing' : 'View'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RecommendationsSection({
  tenantId,
  studentId,
}: {
  tenantId: string;
  studentId: string;
}) {
  const { data: insights, isLoading } = useStudentInsights(tenantId, studentId);
  const dismissMutation = useDismissInsight(tenantId);

  if (isLoading) {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-3">Recommendations</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg border bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!insights || insights.length === 0) return null;

  // Sort by priority: high > medium > low
  const sorted = [...insights].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return (order[a.priority] ?? 2) - (order[b.priority] ?? 2);
  });

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Recommendations</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {sorted.map((insight) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            onDismiss={(id) => dismissMutation.mutate(id)}
          />
        ))}
      </div>
    </div>
  );
}
