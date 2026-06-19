"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ArrowUpDown, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, timeAgo, formatCompact, chapterLabel } from "@/lib/utils";
import type { ChapterSummary } from "@/types";

const PER_PAGE = 100;

export function ChapterList({
  slug,
  chapters,
}: {
  slug: string;
  chapters: ChapterSummary[];
}) {
  const [query, setQuery] = React.useState("");
  const [newestFirst, setNewestFirst] = React.useState(true);
  const [page, setPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = chapters;
    if (q) {
      list = list.filter(
        (c) =>
          chapterLabel(c.number, c.title).toLowerCase().includes(q) ||
          String(c.number).includes(q)
      );
    }
    const sorted = [...list].sort((a, b) =>
      newestFirst ? b.number - a.number : a.number - b.number
    );
    return sorted;
  }, [chapters, query, newestFirst]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  React.useEffect(() => {
    setPage(1);
  }, [query, newestFirst]);

  return (
    <div>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-text-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter chapters…"
            className="pl-9"
            aria-label="Filter chapters"
          />
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setNewestFirst((s) => !s)}
          className="shrink-0"
        >
          <ArrowUpDown className="h-4 w-4" />
          {newestFirst ? "Newest first" : "Oldest first"}
        </Button>
      </div>

      <div className="max-h-[600px] overflow-y-auto rounded-lg border border-brand-surface scrollbar-thin">
        <ul className="divide-y divide-brand-surface">
          {pageItems.map((ch) => (
            <li key={ch.id}>
              <Link
                href={`/comics/${slug}/chapter/${ch.number}`}
                className="flex items-center justify-between gap-3 px-4 py-3 transition-colors duration-150 hover:bg-brand-card-hover"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {chapterLabel(ch.number, ch.title)}
                  </p>
                  <p className="text-xs text-brand-text-muted">
                    {timeAgo(ch.publishedAt)}
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 text-xs text-brand-text-secondary">
                  <Eye className="h-3.5 w-3.5" />
                  {formatCompact(ch.views)}
                </span>
              </Link>
            </li>
          ))}
          {pageItems.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-brand-text-secondary">
              No chapters match your filter.
            </li>
          )}
        </ul>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="px-2 text-sm text-brand-text-secondary">
            Page {page} / {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
