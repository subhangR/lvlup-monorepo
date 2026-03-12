import { useSWUpdate } from '../../hooks/use-sw-update';
import { RefreshCw } from 'lucide-react';

export function SWUpdateNotification() {
  const { updateAvailable, applyUpdate } = useSWUpdate();

  if (!updateAvailable) return null;

  return (
    <div className="fixed left-4 right-4 top-4 z-[60] animate-in slide-in-from-top-4 duration-300 md:left-auto md:right-4 md:max-w-sm">
      <div className="flex items-center gap-3 rounded-lg border bg-background p-3 shadow-lg">
        <RefreshCw className="h-5 w-5 shrink-0 text-primary" />
        <p className="flex-1 text-sm">A new version is available.</p>
        <button
          onClick={applyUpdate}
          className="min-h-[44px] min-w-[44px] rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
