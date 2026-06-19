"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ArrowDownUp, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { timeAgo, formatCompact, formatChapterNumber } from "@/lib/utils";
import type { ChapterPreview } from "@/lib/types";

const PER_PAGE = 100;

export function ChapterList({
  slug,
  chapters,
}: {
  slug: string;
  chapters: ChapterPreview[];
}) {
  const [query, setQuery] = React.useState("");
  const [newestFirst, setNewestFirst] = React.useState(true);
  const [page, setPage] = React.useState(0);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = chapters;
    if (q) {
      list = list.filter(
        (c) =>
          formatChapterNumber(c.number).includes(q) ||
          (c.title ?? "").toLowerCase().includes(q),
      );
    }
    list = [...list].sort((a, b) => (newestFirst ? b.number - a.number : a.number - b.number));
    return list;
  }, [chapters, query, newestFirst]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageItems = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  React.useEffect(() => setPage(0), [query, newestFirst]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-text-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chapters…"
            className="pl-9"
            aria-label="Search chapters"
          />
        </div>
        <Button variant="secondary" size="sm" onClick={() => setNewestFirst((v) => !v)}>
          <ArrowDownUp className="h-4 w-4" />
          {newestFirst ? "Newest" : "Oldest"}
        </Button>
      </div>

      <div className="max-h-[600px] divide-y divide-brand-surface overflow-y-auto rounded-lg border border-brand-surface scrollbar-thin">
        {pageItems.length === 0 && (
          <p className="p-6 text-center text-sm text-brand-text-secondary">No chapters found.</p>
        )}
        {pageItems.map((ch) => (
          <Link
            key={ch.id}
            href={`/comics/${slug}/chapter/${ch.number}`}
            className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-brand-card-hover"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                Chapter {formatChapterNumber(ch.number)}
                {ch.title ? <span className="text-brand-text-secondary"> — {ch.title}</span> : null}
              </p>
              <p className="mt-0.5 flex items-center gap-3 text-xs text-brand-text-muted">
                <span>{timeAgo(ch.publishedAt)}</span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="h-3 w-3" /> {formatCompact(ch.views)}
                </span>
              </p>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Prev
          </Button>
          <span className="text-sm text-brand-text-secondary">
            Page {page + 1} / {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
