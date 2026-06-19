"use client";

import Link from "next/link";
import { ArrowDownUp, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Chapter } from "@/lib/mock-data";
import { formatViews, relativeDate } from "@/lib/utils";

export function ChapterList({ chapters, comicSlug }: { chapters: Chapter[]; comicSlug: string }) {
  const [query, setQuery] = useState("");
  const [sortNewest, setSortNewest] = useState(true);
  const [visible, setVisible] = useState(100);

  const filtered = useMemo(() => {
    const lowered = query.toLowerCase();
    return chapters
      .filter((chapter) => chapter.title.toLowerCase().includes(lowered) || String(chapter.number).includes(lowered))
      .sort((a, b) => (sortNewest ? b.number - a.number : a.number - b.number));
  }, [chapters, query, sortNewest]);

  return (
    <section className="rounded-xl border border-brand-surface bg-brand-card p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-black">Chapters</h2>
          <p className="text-sm text-brand-textSecondary">{chapters.length} chapters available</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-textMuted" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter chapters..." className="pl-9" />
          </div>
          <Button variant="outline" onClick={() => setSortNewest((value) => !value)}>
            <ArrowDownUp className="h-4 w-4" />
            {sortNewest ? "Newest" : "Oldest"}
          </Button>
        </div>
      </div>

      <div className="mt-5 max-h-[680px] overflow-y-auto rounded-lg border border-brand-surface">
        {filtered.slice(0, visible).map((chapter) => (
          <Link
            key={chapter.id}
            href={`/comics/${comicSlug}/chapter/${chapter.number}`}
            className="grid grid-cols-[1fr_auto] gap-3 border-b border-brand-surface px-4 py-3 hover:bg-brand-cardHover md:grid-cols-[120px_1fr_140px_100px]"
          >
            <span className="font-bold text-white">Chapter {chapter.number}</span>
            <span className="hidden min-w-0 truncate text-brand-textSecondary md:block">{chapter.title}</span>
            <span className="text-sm text-brand-textMuted">{relativeDate(chapter.publishedAt)}</span>
            <span className="hidden text-right text-sm text-brand-textMuted md:block">{formatViews(chapter.views)}</span>
          </Link>
        ))}
      </div>

      {visible < filtered.length && (
        <div className="mt-4 text-center">
          <Button variant="secondary" onClick={() => setVisible((count) => count + 100)}>
            Load 100 more
          </Button>
        </div>
      )}
    </section>
  );
}
