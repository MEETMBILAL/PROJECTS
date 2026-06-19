'use client';

import { Button } from '@/components/ui/button';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="container flex min-h-[70vh] flex-col items-center justify-center gap-4 pt-20 text-center">
      <h1 className="text-3xl font-bold text-white">Something went wrong</h1>
      <p className="max-w-lg text-brand-secondary">{error.message || 'The reader hit an unexpected error.'}</p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
