import { Loader2 } from 'lucide-react';

const Loading = () => (
  <div
    role="status"
    aria-live="polite"
    className="flex items-center justify-center w-full h-full min-h-[50vh]"
  >
    <Loader2 className="w-8 h-8 animate-spin text-primary" aria-hidden="true" />
    <span className="sr-only">Loading</span>
  </div>
);

export default Loading;
