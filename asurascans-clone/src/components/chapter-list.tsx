"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowDownUp, Eye, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Chapter } from "@/lib/types";
import { cn, formatCompact, timeAgo } from "@/lib/utils";

const PAGE_SIZE = 100;

export function ChapterList({
  slug,
  chapters,
}: {
  slug: string;
  chapters: Chapter[];
}) {
  const [query, setQuery] = React.useState("");
  const [order, setOrder] = React.useState<"desc" | "asc">("desc");
  const [page, setPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    let list = [...chapters];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          String(c.number).includes(q) ||
          (c.title ?? "").toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => (order === "asc" ? a.number - b.number : b.number - a.number));
    return list;
  }, [chapters, query, order]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  React.useEffect(() => setPage(1), [query, order]);

  return (
    <div className="rounded-lg border border-brand-border bg-brand-card">
      <div className="flex flex-col gap-3 border-b border-brand-border p-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-white">
          Chapters{" "}
          <span className="text-sm font-normal text-brand-text-muted">
            ({chapters.length})
          </span>
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-text-muted" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chapters…"
              className="h-9 pl-8"
              aria-label="Search chapters"
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setOrder((o) => (o === "desc" ? "asc" : "desc"))}
            className="h-9 shrink-0"
          >
            <ArrowDownUp className="h-4 w-4" />
            {order === "desc" ? "Newest" : "Oldest"}
          </Button>
        </div>
      </div>

      {/* Scrollable, "virtualized" via paging for large lists */}
      <ul className="max-h-[600px] divide-y divide-brand-border/60 overflow-y-auto">
        {visible.length === 0 && (
          <li className="p-6 text-center text-sm text-brand-text-secondary">
            No chapters match “{query}”.
          </li>
        )}
        {visible.map((ch) => (
          <li key={ch.id}>
            <Link
              href={`/comics/${slug}/chapter/${ch.number}`}
              className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-brand-card-hover"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  Chapter {ch.number}
                  {ch.title ? (
                    <span className="text-brand-text-secondary"> — {ch.title}</span>
                  ) : null}
                </p>
                <p className="text-xs text-brand-text-muted">
                  {timeAgo(ch.publishedAt)}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1 text-xs text-brand-text-muted">
                <Eye className="h-3.5 w-3.5" />
                {formatCompact(ch.views)}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-brand-border p-3 text-sm">
          <Button
            variant="ghost"
            size="sm"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-brand-text-secondary">
            Page {safePage} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
