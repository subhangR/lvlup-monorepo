import { useState } from "react";
import { usePerformanceTrends, type TrendDataPoint } from "@levelup/shared-hooks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  Button,
} from "@levelup/shared-ui";
import { TrendingUp } from "lucide-react";

type TimeRange = "7d" | "30d" | "90d" | "all";

const RANGE_LABELS: Record<TimeRange, string> = {
  "7d": "7 Days",
  "30d": "30 Days",
  "90d": "90 Days",
  all: "All Time",
};

function MiniLineChart({ data }: { data: TrendDataPoint[] }) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No data available for this time range
      </p>
    );
  }

  const maxScore = Math.max(...data.map((d) => d.score), 100);
  const width = 100;
  const height = 40;
  const padding = 2;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2;

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * chartW;
    const y = padding + chartH - (d.score / maxScore) * chartH;
    return `${x},${y}`;
  });

  const polyline = points.join(" ");

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-48"
        preserveAspectRatio="none"
        role="img"
        aria-label={`Performance trend chart showing ${data.length} data points`}
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((pct) => {
          const y = padding + chartH - (pct / maxScore) * chartH;
          return (
            <line
              key={pct}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              stroke="currentColor"
              className="text-muted/20"
              strokeWidth="0.2"
            />
          );
        })}
        {/* Line */}
        <polyline
          points={polyline}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Dots */}
        {data.map((d, i) => {
          const x = padding + (i / Math.max(data.length - 1, 1)) * chartW;
          const y = padding + chartH - (d.score / maxScore) * chartH;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="0.6"
              fill="hsl(var(--primary))"
            >
              <title>{`${d.date}: ${d.score}% (${d.subject})`}</title>
            </circle>
          );
        })}
      </svg>
      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-muted-foreground px-1 mt-1">
        <span>{data[0]?.date ?? ""}</span>
        <span>{data[data.length - 1]?.date ?? ""}</span>
      </div>
    </div>
  );
}

export function PerformanceTrendsChart({
  tenantId,
  studentId,
}: {
  tenantId: string | null;
  studentId: string | null;
}) {
  const [range, setRange] = useState<TimeRange>("30d");
  const { data: trendData, isLoading } = usePerformanceTrends(tenantId, studentId, range);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" aria-hidden="true" />
            Performance Trends
          </CardTitle>
          <div className="flex gap-1">
            {(Object.keys(RANGE_LABELS) as TimeRange[]).map((r) => (
              <Button
                key={r}
                variant={range === r ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setRange(r)}
              >
                {RANGE_LABELS[r]}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-48 w-full rounded" />
        ) : (
          <MiniLineChart data={trendData ?? []} />
        )}
      </CardContent>
    </Card>
  );
}
