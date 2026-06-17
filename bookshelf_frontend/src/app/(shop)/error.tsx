"use client";

export default function ShopError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-bs flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl text-primary">Something went wrong</h2>
      <p className="text-text-secondary">
        We couldn&apos;t load this page. Please try again.
      </p>
      <button type="button" onClick={reset} className="btn-primary">
        Try again
      </button>
    </div>
  );
}
