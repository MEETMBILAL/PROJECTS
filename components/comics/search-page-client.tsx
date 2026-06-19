use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ComicCard } from '@/components/comics/comic-card';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import type { ComicDTO } from '@/lib/types';

export function SearchPageClient({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [items, setItems] = useState<ComicDTO[]>([]);
  const debounced = useDebounce(query, 300);

  useEffect(() => {
    if (!debounced.trim()) { setItems([]); return; }
    fetch(`/api/search?q=${encodeURIComponent(debounced)}`).then((response) => response.json()).then((payload) => setItems(payload.items ?? [])).catch(() => setItems([]));
  }, [debounced]);

  return (
    <section className="mt-8 space-y-6">
      <div className="relative max-w-2xl"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Search comics..." /></div>
      {query && items.length === 0 ? <div className="rounded-xl border border-brand-surface bg-brand-card p-10 text-center text-brand-secondary">No results found.</div> : null}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">{items.map((comic) => <ComicCard key={comic.id} comic={comic} />)}</div>
    </section>
  );
}
