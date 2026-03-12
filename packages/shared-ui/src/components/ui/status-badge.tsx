import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const statusStyles = {
  active: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  inactive: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  trial: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  suspended: "bg-destructive/10 text-destructive",
  expired: "bg-muted text-muted-foreground",
  operational: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  degraded: "bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400",
  down: "bg-destructive/10 text-destructive",
  draft: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  published: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  archived: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  grading: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  completed: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  results_released: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  question_paper_uploaded: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  question_paper_extracted: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pending: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  deleted: "bg-destructive/10 text-destructive",
} as const;

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
  {
    variants: {
      status: statusStyles,
    },
    defaultVariants: {
      status: "active",
    },
  }
);

/** All status values accepted by StatusBadge. */
export type StatusBadgeStatus = keyof typeof statusStyles;

interface StatusBadgeProps {
  status: StatusBadgeStatus;
  className?: string;
  children?: React.ReactNode;
}

export function StatusBadge({ status, className, children }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status }), className)}>
      <span className="sr-only">Status: </span>
      {children ?? String(status).replace(/_/g, " ")}
    </span>
  );
}
