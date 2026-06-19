use client';

import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import type { ComicDTO } from '@/lib/types';

export function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ComicDTO[]>([]);
  const debounced = useDebounce(query, 300);

  useEffect(() => {
    if (!debounced.trim()) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    fetch(`/api/search?q=${encodeURIComponent(debounced)}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((payload) => setResults(payload.items ?? []))
      .catch(() => undefined);
    return () => controller.abort();
  }, [debounced]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open search"><Search className="h-5 w-5" /></Button>
      </DialogTrigger>
      <DialogContent className="top-24 translate-y-0 sm:top-28">
        <DialogTitle className="sr-only">Search comics</DialogTitle>
        <div className="flex items-center gap-3 border-b border-brand-surface pb-4">
          <Search className="h-5 w-5 text-brand-muted" />
          <Input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search manga, manhwa, authors, genres..." aria-label="Search query" className="border-0 bg-transparent text-lg focus-visible:ring-0" />
        </div>
        <div className="max-h-[60vh] space-y-2 overflow-y-auto pt-3">
          {query && results.length === 0 ? <p className="py-10 text-center text-brand-secondary">No results found.</p> : null}
          {results.map((comic) => (
            <Link key={comic.id} href={`/comics/${comic.slug}`} onClick={() => setOpen(false)} className="focus-purple flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-brand-cardHover">
              <div className="relative h-16 w-12 overflow-hidden rounded bg-brand-surface"><Image src={comic.coverImage} alt="" fill sizes="48px" className="object-cover" /></div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">{comic.title}</p>
                <p className="text-sm text-brand-secondary">Latest Chapter {comic.chapters[0]?.number ?? 1}</p>
              </div>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
