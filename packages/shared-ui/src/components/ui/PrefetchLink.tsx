import { useCallback, useRef } from "react";
import { Link, type LinkProps } from "react-router-dom";

/** Map of route paths to their lazy import functions */
export type PrefetchMap = Record<string, () => Promise<unknown>>;

// Track active prefetches to avoid duplicates and limit concurrency
const prefetched = new Set<string>();
const MAX_CONCURRENT = 3;
let activePrefetches = 0;

function prefetchRoute(path: string, prefetchMap: PrefetchMap) {
  // Find the matching route in the prefetch map
  const importFn = prefetchMap[path];
  if (!importFn || prefetched.has(path) || activePrefetches >= MAX_CONCURRENT) return;

  prefetched.add(path);
  activePrefetches++;
  importFn().finally(() => {
    activePrefetches--;
  });
}

export interface PrefetchLinkProps extends LinkProps {
  /** Map of route paths to their lazy import functions */
  prefetchMap: PrefetchMap;
  /** Delay in ms before prefetching (default: 100) */
  prefetchDelay?: number;
}

export function PrefetchLink({
  to,
  prefetchMap,
  prefetchDelay = 100,
  className,
  children,
  ...props
}: PrefetchLinkProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleMouseEnter = useCallback(() => {
    const path = typeof to === "string" ? to : (to.pathname ?? "");
    timerRef.current = setTimeout(() => {
      prefetchRoute(path, prefetchMap);
    }, prefetchDelay);
  }, [to, prefetchMap, prefetchDelay]);

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const handleFocus = useCallback(() => {
    const path = typeof to === "string" ? to : (to.pathname ?? "");
    prefetchRoute(path, prefetchMap);
  }, [to, prefetchMap]);

  return (
    <Link
      to={to}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      {...props}
    >
      {children}
    </Link>
  );
}
