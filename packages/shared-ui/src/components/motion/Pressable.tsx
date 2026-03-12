import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/use-reduced-motion";
import { cn } from "../../lib/utils";

export interface PressableProps {
  children: React.ReactNode;
  /** Scale on press (default: 0.97) */
  pressScale?: number;
  /** Scale on hover (default: 1.02) */
  hoverScale?: number;
  /** Whether the pressable interaction is disabled */
  disabled?: boolean;
  /** HTML element to render as */
  as?: "div" | "button" | "li";
  className?: string;
  onClick?: () => void;
}

/**
 * Micro-interaction wrapper that provides subtle press/hover feedback.
 * Respects prefers-reduced-motion automatically.
 */
export function Pressable({
  children,
  pressScale = 0.97,
  hoverScale = 1.02,
  disabled,
  as = "div",
  className,
  onClick,
}: PressableProps) {
  const reduced = useReducedMotion();

  if (reduced || disabled) {
    const Tag = as;
    return (
      <Tag
        className={className}
        onClick={!disabled ? onClick : undefined}
        role={onClick ? "button" : undefined}
        tabIndex={onClick && !disabled ? 0 : undefined}
      >
        {children}
      </Tag>
    );
  }

  const MotionTag = motion[as];

  return (
    <MotionTag
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: pressScale }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn("cursor-pointer", className)}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </MotionTag>
  );
}
