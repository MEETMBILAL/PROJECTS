use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { ArrowDownUp, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ChapterDTO } from '@/lib/types';
import { compactNumber, formatRelativeTime } from '@/lib/utils';

export function ChapterList({ chapters, slug }: { chapters: ChapterDTO[]; slug: string }) {
  const [query, setQuery] = useState('');
  const [oldestFirst, setOldestFirst] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase().trim();
    const list = chapters.filter((chapter) => (needle ? `${chapter.number} ${chapter.title}`.toLowerCase().includes(needle) : true));
    return oldestFirst ? [...list].sort((a, b) => a.number - b.number) : [...list].sort((a, b) => b.number - a.number);
  }, [chapters, oldestFirst, query]);

  const virtualizer = useVirtualizer({ count: filtered.length, getScrollElement: () => parentRef.current, estimateSize: () => 68, overscan: 8 });

  return (
    <section className="rounded-xl border border-brand-surface bg-brand-card p-4">
      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto]">
        <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search chapters" className="pl-9" aria-label="Search chapters" /></div>
        <Button variant="secondary" onClick={() => setOldestFirst((value) => !value)}><ArrowDownUp className="h-4 w-4" /> {oldestFirst ? 'Oldest' : 'Newest'}</Button>
      </div>
      <div ref={parentRef} className="h-[520px] overflow-auto rounded-lg border border-brand-surface" role="list" aria-label="Chapter list">
        <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
          {virtualizer.getVirtualItems().map((item) => {
            const chapter = filtered[item.index];
            return (
              <Link key={chapter.id} href={`/comics/${slug}/chapter/${chapter.number}`} role="listitem" className="focus-purple absolute left-0 top-0 grid w-full grid-cols-[1fr_auto] gap-3 border-b border-brand-surface px-4 py-3 transition-colors hover:bg-brand-cardHover" style={{ height: `${item.size}px`, transform: `translateY(${item.start}px)` }}>
                <div className="min-w-0"><p className="truncate font-semibold text-white">{chapter.title}</p><p className="text-xs text-brand-muted">{formatRelativeTime(chapter.publishedAt)}</p></div>
                <div className="text-right text-xs text-brand-secondary"><p>{compactNumber(chapter.views)}</p><p>views</p></div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
