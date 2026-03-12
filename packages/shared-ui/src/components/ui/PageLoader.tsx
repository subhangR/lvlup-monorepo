import { Loader2 } from 'lucide-react';

export function PageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center w-full h-full min-h-[50vh]"
    >
      <Loader2 className="w-8 h-8 animate-spin text-primary" aria-hidden="true" />
      <span className="sr-only">Loading page content</span>
    </div>
  );
}
