import { useState, useEffect } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function getInitialState() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(QUERY).matches;
}

/**
 * Returns true when the user has enabled "Reduce motion" in OS settings.
 * All animation components should check this and skip/minimize animations.
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(getInitialState);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}
