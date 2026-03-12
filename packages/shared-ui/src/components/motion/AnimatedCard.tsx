import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/use-reduced-motion";
import { cn } from "../../lib/utils";

export interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedCard({ children, className }: AnimatedCardProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
