"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex flex-col items-center py-20 text-center">
      <AlertTriangle className="h-12 w-12 text-error" />
      <h1 className="mt-4 font-display text-2xl text-text-primary">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-text-secondary">
        We hit an unexpected error. Please try again.
      </p>
      <button type="button" onClick={reset} className="btn-primary mt-6">
        Try again
      </button>
    </div>
  );
}
