"use client";

import { useRef, useMemo, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChapterData } from "@/types";
import { formatViews } from "@/lib/utils";

interface ChapterListProps {
  chapters: ChapterData[];
  comicSlug: string;
}

export function ChapterList({ chapters, comicSlug }: ChapterListProps) {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const parentRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let result = chapters;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (ch) =>
          ch.number.toString().includes(q) ||
          ch.title?.toLowerCase().includes(q)
      );
    }
    result = [...result].sort((a, b) =>
      sortOrder === "newest" ? b.number - a.number : a.number - b.number
    );
    return result;
  }, [chapters, search, sortOrder]);

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 10,
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
          <Input
            placeholder="Search chapters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label="Filter chapters"
          />
        </div>
        <Button
          variant="outline"
          onClick={() =>
            setSortOrder((s) => (s === "newest" ? "oldest" : "newest"))
          }
          className="gap-2"
        >
          <ArrowUpDown className="h-4 w-4" />
          {sortOrder === "newest" ? "Newest" : "Oldest"}
        </Button>
      </div>

      <div
        ref={parentRef}
        className="h-[500px] overflow-y-auto rounded-cover border border-brand-surface"
        role="list"
        aria-label="Chapter list"
      >
        <div
          style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative" }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const chapter = filtered[virtualRow.index];
            return (
              <Link
                key={chapter.id}
                href={`/comics/${comicSlug}/chapter/${chapter.number}`}
                className="absolute left-0 right-0 flex items-center justify-between px-4 py-3 border-b border-brand-surface hover:bg-brand-card-hover transition-colors"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                role="listitem"
              >
                <div className="min-w-0">
                  <span className="font-medium text-brand-text">
                    Chapter {chapter.number}
                  </span>
                  {chapter.title && (
                    <span className="ml-2 text-sm text-brand-secondary truncate">
                      {chapter.title}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 shrink-0 text-xs text-brand-muted">
                  <span>{formatViews(chapter.views)} views</span>
                  <span>
                    {formatDistanceToNow(new Date(chapter.publishedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-brand-secondary py-8">
          No chapters found
        </p>
      )}
    </div>
  );
}
