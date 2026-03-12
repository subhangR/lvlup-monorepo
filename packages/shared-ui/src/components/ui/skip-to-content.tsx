import { cn } from "../../lib/utils";

export interface SkipToContentProps {
  targetId?: string;
  className?: string;
}

/**
 * Visually hidden link that becomes visible on focus.
 * Place at the top of each app layout for keyboard users.
 */
export function SkipToContent({
  targetId = "main-content",
  className,
}: SkipToContentProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50",
        "focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
    >
      Skip to main content
    </a>
  );
}
