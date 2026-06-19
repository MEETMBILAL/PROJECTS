"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatRelativeTime, formatViews } from "@/lib/utils";
import type { ChapterItem } from "@/types";
import { cn } from "@/lib/utils";

interface ChapterListProps {
  chapters: ChapterItem[];
  slug: string;
}

export function ChapterList({ chapters, slug }: ChapterListProps) {
  const [search, setSearch] = useState("");
  const [sortNewest, setSortNewest] = useState(true);
  const parentRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let result = [...chapters];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (ch) =>
          ch.number.toString().includes(q) ||
          ch.title?.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) =>
      sortNewest ? b.number - a.number : a.number - b.number
    );
    return result;
  }, [chapters, search, sortNewest]);

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 10,
  });

  return (
    <div className="rounded-modal border border-brand-surface bg-brand-card p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
          <Input
            placeholder="Search chapters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-brand-surface bg-brand-dark pl-9 text-brand-text-primary"
            aria-label="Search chapters"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortNewest ? "default" : "outline"}
            size="sm"
            onClick={() => setSortNewest(true)}
            className={cn(
              sortNewest && "bg-brand-purple hover:bg-brand-purple-light"
            )}
          >
            Newest
          </Button>
          <Button
            variant={!sortNewest ? "default" : "outline"}
            size="sm"
            onClick={() => setSortNewest(false)}
            className={cn(
              !sortNewest && "bg-brand-purple hover:bg-brand-purple-light"
            )}
          >
            Oldest
          </Button>
        </div>
      </div>

      <div
        ref={parentRef}
        className="h-[500px] overflow-auto scrollbar-thin"
        role="list"
        aria-label="Chapter list"
      >
        <div
          style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative" }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const ch = filtered[virtualRow.index];
            return (
              <Link
                key={ch.id}
                href={`/comics/${slug}/chapter/${ch.number}`}
                role="listitem"
                className="absolute left-0 top-0 flex w-full items-center justify-between border-b border-brand-surface px-4 py-3 transition-colors duration-150 hover:bg-brand-card-hover"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-brand-text-primary">
                    Chapter {ch.number}
                    {ch.title && (
                      <span className="ml-2 text-brand-text-secondary">
                        — {ch.title}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-brand-muted">
                    {formatRelativeTime(ch.publishedAt)} · {formatViews(ch.views)} views
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-brand-text-secondary">
          No chapters found.
        </p>
      )}
    </div>
  );
}
