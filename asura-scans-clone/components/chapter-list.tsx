"use client";

import Link from "next/link";
import { ArrowDownUp, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { compactNumber, relativeTime } from "@/lib/utils";
import type { Chapter } from "@/types/comic";

type ChapterListProps = {
  slug: string;
  chapters: Chapter[];
};

export function ChapterList({ slug, chapters }: ChapterListProps) {
  const [query, setQuery] = useState("");
  const [newestFirst, setNewestFirst] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 100;

  const filtered = useMemo(() => {
    const value = query.toLowerCase().trim();
    const result = chapters.filter(
      (chapter) => !value || chapter.title.toLowerCase().includes(value) || String(chapter.number).includes(value)
    );
    result.sort((a, b) => (newestFirst ? b.number - a.number : a.number - b.number));
    return result;
  }, [chapters, newestFirst, query]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1);

  return (
    <section className="rounded-xl border border-brand-surface bg-brand-card p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="section-heading">Chapter List</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative block sm:w-72">
            <span className="sr-only">Filter chapters</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-textMuted" />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search chapters..."
              className="pl-9"
            />
          </label>
          <Button variant="secondary" onClick={() => setNewestFirst((current) => !current)}>
            <ArrowDownUp className="h-4 w-4" aria-hidden />
            {newestFirst ? "Newest" : "Oldest"}
          </Button>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-brand-surface">
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 bg-brand-nav px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-textMuted">
          <span>Chapter</span>
          <span>Views</span>
          <span>Date</span>
        </div>
        <div className="max-h-[720px] overflow-y-auto">
          {paged.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/comics/${slug}/chapter/${chapter.number}`}
              className="grid grid-cols-[1fr_auto_auto] gap-4 border-t border-brand-surface px-4 py-3 text-sm transition-colors duration-150 hover:bg-brand-cardHover"
            >
              <span className="min-w-0 truncate font-medium text-white">
                Chapter {chapter.number}: {chapter.title}
              </span>
              <span className="text-brand-textSecondary">{compactNumber(chapter.views)}</span>
              <time className="text-brand-textMuted" dateTime={chapter.publishedAt}>
                {relativeTime(chapter.publishedAt)}
              </time>
            </Link>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between text-sm text-brand-textSecondary">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>
              Previous
            </Button>
            <Button
              variant="secondary"
              disabled={page === totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
