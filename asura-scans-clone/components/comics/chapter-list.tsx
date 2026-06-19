"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownUp, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCompactNumber, formatRelativeTime } from "@/lib/format";
import type { Chapter } from "@/lib/types";

export function ChapterList({ slug, chapters }: { slug: string; chapters: Chapter[] }) {
  const [query, setQuery] = useState("");
  const [newest, setNewest] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 100;

  const filtered = useMemo(() => {
    const value = query.toLowerCase();
    const list = chapters.filter((chapter) => `chapter ${chapter.number} ${chapter.title}`.toLowerCase().includes(value));
    return [...list].sort((a, b) => newest ? b.number - a.number : a.number - b.number);
  }, [chapters, newest, query]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  return (
    <section className="rounded-xl border border-brand-surface bg-brand-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-sm sm:flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter chapters" className="border-brand-surface bg-brand-background pl-9" />
        </div>
        <Button variant="outline" onClick={() => setNewest((value) => !value)} className="border-brand-primary text-brand-light hover:bg-brand-primary hover:text-white">
          <ArrowDownUp className="mr-2 h-4 w-4" /> {newest ? "Newest" : "Oldest"}
        </Button>
      </div>
      <div className="mt-4 max-h-[680px] overflow-y-auto rounded-lg border border-brand-surface" role="list" aria-label="Chapter list">
        {paginated.map((chapter) => (
          <Link key={chapter.id} href={`/comics/${slug}/chapter/${chapter.number}`} className="grid grid-cols-[1fr_auto] gap-3 border-b border-brand-surface px-4 py-3 last:border-0 hover:bg-brand-hover sm:grid-cols-[1fr_130px_110px]" role="listitem">
            <div>
              <p className="font-semibold text-white">Chapter {chapter.number}{chapter.title ? `: ${chapter.title}` : ""}</p>
              <p className="mt-1 text-xs text-brand-muted sm:hidden">{formatRelativeTime(chapter.publishedAt)} - {formatCompactNumber(chapter.views)} views</p>
            </div>
            <span className="hidden text-sm text-brand-secondary sm:block">{formatRelativeTime(chapter.publishedAt)}</span>
            <span className="hidden text-right text-sm text-brand-secondary sm:block">{formatCompactNumber(chapter.views)} views</span>
          </Link>
        ))}
      </div>
      {totalPages > 1 ? (
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Prev</Button>
          <span className="text-sm text-brand-secondary">Page {page} of {totalPages}</span>
          <Button variant="outline" disabled={page === totalPages} onClick={() => setPage((value) => value + 1)}>Next</Button>
        </div>
      ) : null}
    </section>
  );
}
