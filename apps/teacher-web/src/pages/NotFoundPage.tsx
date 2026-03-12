import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <FileQuestion className="h-16 w-16 text-muted-foreground" />
      <h1 className="mt-4 text-2xl font-bold">Page Not Found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
