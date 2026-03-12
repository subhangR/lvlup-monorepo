import { useState } from "react";
import { useQuotaStatus } from "@levelup/shared-hooks";
import { X, AlertTriangle, AlertCircle, Clock } from "lucide-react";

export default function QuotaWarningBanner() {
  const warning = useQuotaStatus();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || warning.level === "none") return null;

  const config = {
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
      text: "text-amber-800 dark:text-amber-200",
      subText: "text-amber-700 dark:text-amber-300",
      icon: AlertTriangle,
    },
    red: {
      bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
      text: "text-red-800 dark:text-red-200",
      subText: "text-red-700 dark:text-red-300",
      icon: AlertCircle,
    },
    expired: {
      bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
      text: "text-red-800 dark:text-red-200",
      subText: "text-red-700 dark:text-red-300",
      icon: Clock,
    },
  }[warning.level];

  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-3 rounded-lg border px-4 py-3 mb-4 ${config.bg}`}>
      <Icon className={`h-5 w-5 shrink-0 ${config.text}`} />
      <p className={`flex-1 text-sm ${config.subText}`}>{warning.message}</p>
      <button
        onClick={() => setDismissed(true)}
        className={`shrink-0 rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/5 ${config.text}`}
        aria-label="Dismiss warning"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
