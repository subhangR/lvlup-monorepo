import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "../../hooks/use-reduced-motion";

export interface PageTransitionProps {
  children: React.ReactNode;
  /** Unique key per route — typically `location.pathname` */
  pageKey: string;
}

export function PageTransition({ children, pageKey }: PageTransitionProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
