import type { TestAnalytics } from "@levelup/shared-types";
import { Lightbulb, BookOpen, Target, Brain, PartyPopper } from "lucide-react";

interface Recommendation {
  icon: typeof Lightbulb;
  title: string;
  description: string;
  priority: number; // lower = more urgent
}

interface Props {
  analytics: TestAnalytics;
  maxItems?: number;
}

const BLOOMS_DESCRIPTIONS: Record<string, string> = {
  remember: "recalling facts and basic concepts",
  understand: "explaining ideas or concepts",
  apply: "using information in new situations",
  analyze: "drawing connections among ideas",
  evaluate: "justifying a stand or decision",
  create: "producing new or original work",
};

export default function StudyRecommendations({ analytics, maxItems = 5 }: Props) {
  const recommendations: Recommendation[] = [];

  // Topic recommendations (< 50% accuracy)
  if (analytics.topicBreakdown) {
    for (const [topic, data] of Object.entries(analytics.topicBreakdown)) {
      if (data.total === 0) continue;
      const pct = data.correct / data.total;
      if (pct < 0.5) {
        recommendations.push({
          icon: BookOpen,
          title: `Focus on ${topic}`,
          description: `You scored ${Math.round(pct * 100)}% in this topic. Review the fundamentals and practice more problems.`,
          priority: pct,
        });
      }
    }
  }

  // Difficulty recommendations (< 40% accuracy)
  if (analytics.difficultyBreakdown) {
    for (const [level, data] of Object.entries(analytics.difficultyBreakdown)) {
      if (data.total === 0) continue;
      const pct = data.correct / data.total;
      if (pct < 0.4) {
        recommendations.push({
          icon: Target,
          title: `Practice more ${level} questions`,
          description: `Only ${Math.round(pct * 100)}% accuracy on ${level} difficulty. Build up gradually from easier problems.`,
          priority: pct,
        });
      }
    }
  }

  // Bloom's recommendations (< 50% accuracy)
  if (analytics.bloomsBreakdown) {
    for (const [level, data] of Object.entries(analytics.bloomsBreakdown)) {
      if (data.total === 0) continue;
      const pct = data.correct / data.total;
      if (pct < 0.5) {
        const desc = BLOOMS_DESCRIPTIONS[level] ?? level;
        recommendations.push({
          icon: Brain,
          title: `Work on ${level} skills`,
          description: `${Math.round(pct * 100)}% accuracy at ${desc}. Practice exercises that require ${desc}.`,
          priority: pct,
        });
      }
    }
  }

  // Time-based recommendations
  if (analytics.topicBreakdown && analytics.timePerQuestion && analytics.averageTimePerQuestion) {
    const avgTime = analytics.averageTimePerQuestion;
    for (const [_topic, data] of Object.entries(analytics.topicBreakdown)) {
      if (data.total === 0) continue;
      // Calculate average time for this topic's questions (simplified check)
      const pct = data.correct / data.total;
      if (pct < 0.5 && avgTime > 0) {
        // Already covered by topic recommendation above
        continue;
      }
    }
  }

  // Sort by priority (lowest accuracy first) and limit
  recommendations.sort((a, b) => a.priority - b.priority);
  const display = recommendations.slice(0, maxItems);

  // All areas > 70% — show congratulatory message
  if (display.length === 0) {
    return (
      <div className="rounded-lg border bg-emerald-50/50 p-4 text-center dark:bg-emerald-950/20">
        <PartyPopper className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
        <p className="font-medium text-emerald-700 dark:text-emerald-300">Great job!</p>
        <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">
          You&apos;re performing well across all areas. Keep it up!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {display.map((rec, idx) => {
        const Icon = rec.icon;
        return (
          <div key={idx} className="flex items-start gap-3 rounded-lg border p-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Icon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium">{rec.title}</p>
              <p className="text-muted-foreground text-xs">{rec.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
