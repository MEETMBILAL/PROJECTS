import { Suspense } from 'react';
import { SearchPageClient } from '@/components/comics/search-page-client';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  return (
    <main className="container pt-28">
      <h1 className="text-4xl font-black text-white">Search</h1>
      <p className="mt-2 text-brand-secondary">Instant debounced search across titles, creators, and genres.</p>
      <Suspense fallback={<Skeleton className="mt-8 h-96" />}><SearchPageClient initialQuery={searchParams.q ?? ''} /></Suspense>
    </main>
  );
}
