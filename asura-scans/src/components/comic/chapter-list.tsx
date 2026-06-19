"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowDownUp, Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, timeAgo, formatCompact, formatChapterNumber } from "@/lib/utils";
import type { ChapterDTO } from "@/lib/types";

interface ChapterListProps {
  slug: string;
  chapters: ChapterDTO[];
  lastReadChapter?: number | null;
}

const PAGE_SIZE = 100;

export function ChapterList({ slug, chapters, lastReadChapter }: ChapterListProps) {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<"desc" | "asc">("desc");
  const [page, setPage] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let list = [...chapters];
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (c) =>
          String(c.number).includes(q) ||
          c.title?.toLowerCase().includes(q),
      );
    }
    list.sort((a, b) => (order === "desc" ? b.number - a.number : a.number - b.number));
    return list;
  }, [chapters, query, order]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = useMemo(
    () => filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [filtered, page],
  );

  const virtualizer = useVirtualizer({
    count: pageItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 8,
  });

  return (
    <div className="rounded-lg border border-brand-surface bg-brand-card">
      <div className="flex flex-col gap-3 border-b border-brand-surface p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-text-muted" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search chapters..."
            className="pl-9"
            aria-label="Search chapters"
          />
        </div>
        <Button
          variant="secondary"
          onClick={() => setOrder((o) => (o === "desc" ? "asc" : "desc"))}
          className="shrink-0"
        >
          <ArrowDownUp />
          {order === "desc" ? "Newest" : "Oldest"}
        </Button>
      </div>

      <div ref={parentRef} className="max-h-[560px] overflow-y-auto">
        {pageItems.length === 0 ? (
          <p className="p-8 text-center text-sm text-brand-text-secondary">
            No chapters match your search.
          </p>
        ) : (
          <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
            {virtualizer.getVirtualItems().map((vitem) => {
              const ch = pageItems[vitem.index];
              const isRead =
                lastReadChapter != null && ch.number <= lastReadChapter;
              return (
                <div
                  key={ch.id}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: vitem.size,
                    transform: `translateY(${vitem.start}px)`,
                  }}
                >
                  <Link
                    href={`/comics/${slug}/chapter/${ch.number}`}
                    className={cn(
                      "flex h-full items-center justify-between gap-3 border-b border-brand-surface/60 px-4 transition-colors hover:bg-brand-card-hover",
                      isRead && "opacity-50",
                    )}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        Chapter {formatChapterNumber(ch.number)}
                        {ch.title ? (
                          <span className="ml-2 font-normal text-brand-text-secondary">
                            {ch.title}
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 flex items-center gap-3 text-xs text-brand-text-muted">
                        <span>{timeAgo(ch.publishedAt)}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" /> {formatCompact(ch.views)}
                        </span>
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2 border-t border-brand-surface p-3">
          <Button
            size="sm"
            variant="secondary"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Previous
          </Button>
          <span className="text-xs text-brand-text-secondary">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="secondary"
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
