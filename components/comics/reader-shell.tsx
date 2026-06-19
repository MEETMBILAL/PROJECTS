use client';

import { ArrowLeft, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ChapterDTO, ComicDTO } from '@/lib/types';
import { cn } from '@/lib/utils';

export function ReaderShell({ comic, chapter }: { comic: ComicDTO; chapter: ChapterDTO }) {
  const [mode, setMode] = useState<'strip' | 'paged'>('strip');
  const [page, setPage] = useState(0);
  const [background, setBackground] = useState('#000000');
  const sorted = useMemo(() => [...comic.chapters].sort((a, b) => a.number - b.number), [comic.chapters]);
  const index = sorted.findIndex((item) => item.number === chapter.number);
  const prev = sorted[index - 1];
  const next = sorted[index + 1];
  const progress = mode === 'paged' ? ((page + 1) / chapter.pages.length) * 100 : ((index + 1) / sorted.length) * 100;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft' && prev) window.location.href = `/comics/${comic.slug}/chapter/${prev.number}`;
      if (event.key === 'ArrowRight' && next) window.location.href = `/comics/${comic.slug}/chapter/${next.number}`;
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [comic.slug, next, prev]);

  const pages = mode === 'paged' ? chapter.pages.slice(page, page + 1) : chapter.pages;

  return (
    <div className="min-h-screen" style={{ background }}>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/90 backdrop-blur">
        <div className="mx-auto flex h-[60px] max-w-6xl items-center gap-3 px-4">
          <Button asChild variant="ghost" size="icon"><Link href={`/comics/${comic.slug}`} aria-label="Back to comic"><ArrowLeft className="h-5 w-5" /></Link></Button>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-white">{comic.title}</p><p className="text-xs text-brand-secondary">{chapter.title}</p></div>
          <Select value={String(chapter.number)} onValueChange={(value) => { window.location.href = `/comics/${comic.slug}/chapter/${value}`; }}><SelectTrigger className="hidden w-40 md:flex"><SelectValue /></SelectTrigger><SelectContent>{sorted.map((item) => <SelectItem key={item.id} value={String(item.number)}>Chapter {item.number}</SelectItem>)}</SelectContent></Select>
          <Button asChild variant="ghost" size="icon" disabled={!prev}><Link href={prev ? `/comics/${comic.slug}/chapter/${prev.number}` : '#'} aria-label="Previous chapter"><ChevronLeft className="h-5 w-5" /></Link></Button>
          <Button asChild variant="ghost" size="icon" disabled={!next}><Link href={next ? `/comics/${comic.slug}/chapter/${next.number}` : '#'} aria-label="Next chapter"><ChevronRight className="h-5 w-5" /></Link></Button>
        </div>
      </header>
      <main className="mx-auto max-w-[800px] py-4">
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2 px-4">
          <Button size="sm" variant={mode === 'strip' ? 'default' : 'secondary'} onClick={() => setMode('strip')}>Long strip</Button>
          <Button size="sm" variant={mode === 'paged' ? 'default' : 'secondary'} onClick={() => setMode('paged')}>Paginated</Button>
          <Button size="sm" variant="secondary" onClick={() => setBackground(background === '#000000' ? '#0F0F0F' : '#000000')}><Settings className="h-4 w-4" /> Background</Button>
          <span className="text-xs text-brand-secondary">Quality: optimized</span>
        </div>
        <div className={cn('space-y-0', mode === 'paged' && 'px-4')}>
          {pages.map((item) => <Image key={item.id} src={item.imageUrl} alt={`${comic.title} ${chapter.title} page ${item.pageNumber}`} width={item.width ?? 900} height={item.height ?? 1400} sizes="800px" loading="lazy" className="h-auto w-full" />)}
        </div>
        {mode === 'paged' ? <div className="my-6 flex justify-center gap-3"><Button variant="secondary" onClick={() => setPage((value) => Math.max(0, value - 1))}>Prev page</Button><Button onClick={() => setPage((value) => Math.min(chapter.pages.length - 1, value + 1))}>Next page</Button></div> : null}
      </main>
      <footer className="sticky bottom-0 border-t border-white/10 bg-black/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Button asChild variant="secondary" disabled={!prev}><Link href={prev ? `/comics/${comic.slug}/chapter/${prev.number}` : '#'}>Previous</Link></Button>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-brand-surface"><div className="h-full bg-brand-primary" style={{ width: `${progress}%` }} /></div>
          <Button asChild disabled={!next}><Link href={next ? `/comics/${comic.slug}/chapter/${next.number}` : '#'}>Next</Link></Button>
        </div>
      </footer>
    </div>
  );
}
