import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../hooks/use-reduced-motion";
import { cn } from "../../lib/utils";

export interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function CountUp({
  end,
  start = 0,
  duration = 1,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: CountUpProps) {
  const reduced = useReducedMotion();
  const [current, setCurrent] = useState(reduced ? end : start);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (reduced) {
      setCurrent(end);
      return;
    }

    const startTime = performance.now();
    const diff = end - start;

    function step(now: number) {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(start + diff * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    }

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [end, start, duration, reduced]);

  return (
    <span className={cn(className)}>
      {prefix}
      {current.toFixed(decimals)}
      {suffix}
    </span>
  );
}
