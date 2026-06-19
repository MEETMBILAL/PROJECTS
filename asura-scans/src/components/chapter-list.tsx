"use client";

import { useMemo, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChapterListItem } from "@/types";
import { formatViews } from "@/lib/utils";

interface ChapterListProps {
  chapters: ChapterListItem[];
  comicSlug: string;
}

export function ChapterList({ chapters, comicSlug }: ChapterListProps) {
  const [search, setSearch] = useState("");
  const [sortNewest, setSortNewest] = useState(true);
  const parentRef = useMemo(() => ({ current: null as HTMLDivElement | null }), []);

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
    return sortNewest ? [...result].reverse() : result;
  }, [chapters, search, sortNewest]);

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
            aria-label="Search chapters"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setSortNewest(!sortNewest)}
          aria-label={`Sort ${sortNewest ? "oldest" : "newest"} first`}
        >
          <ArrowUpDown className="h-4 w-4 mr-2" />
          {sortNewest ? "Newest" : "Oldest"}
        </Button>
      </div>

      <div
        ref={(el) => { parentRef.current = el; }}
        className="h-[500px] overflow-auto rounded-cover border border-brand-surface"
        role="list"
        aria-label="Chapter list"
      >
        <div
          style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative" }}
        >
          {virtualizer.getVirtualItems().map((item) => {
            const ch = filtered[item.index];
            return (
              <div
                key={ch.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${item.size}px`,
                  transform: `translateY(${item.start}px)`,
                }}
              >
                <Link
                  href={`/comics/${comicSlug}/chapter/${ch.number}`}
                  className="flex items-center justify-between px-4 py-3 border-b border-brand-surface hover:bg-brand-card-hover transition-colors"
                  role="listitem"
                >
                  <div>
                    <span className="text-brand-text-primary font-medium">
                      Chapter {ch.number}
                    </span>
                    {ch.title && (
                      <span className="text-brand-text-secondary ml-2 text-sm">
                        {ch.title}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-brand-muted">
                    <span>{formatViews(ch.views)} views</span>
                    <span>
                      {formatDistanceToNow(new Date(ch.publishedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
