import type { BadgeProps } from "@levelup/shared-ui";

export const STATUS_VARIANT: Record<string, BadgeProps["variant"]> = {
  draft: "secondary",
  published: "default",
  active: "default",
  scheduled: "outline",
  grading: "outline",
  completed: "secondary",
  archived: "secondary",
};

export const TYPE_VARIANT: Record<string, BadgeProps["variant"]> = {
  learning: "outline",
  practice: "outline",
  assessment: "default",
  resource: "secondary",
  hybrid: "outline",
};
