"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Search, ArrowUpDown } from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ChapterListItem } from "@/lib/types";
import { formatViews } from "@/lib/utils";

interface ChapterListProps {
  chapters: ChapterListItem[];
  slug: string;
}

export function ChapterList({ chapters, slug }: ChapterListProps) {
  const [search, setSearch] = useState("");
  const [sortNewest, setSortNewest] = useState(true);

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
    result.sort((a, b) => (sortNewest ? b.number - a.number : a.number - b.number));
    return result;
  }, [chapters, search, sortNewest]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-text-muted" />
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
          className="flex items-center gap-2"
          aria-label={`Sort ${sortNewest ? "oldest" : "newest"} first`}
        >
          <ArrowUpDown className="h-4 w-4" />
          {sortNewest ? "Newest" : "Oldest"}
        </Button>
      </div>

      <div className="rounded-lg border border-brand-surface bg-brand-card overflow-hidden">
        {filtered.length > 100 ? (
          <Virtuoso
            style={{ height: "500px" }}
            data={filtered}
            itemContent={(_, chapter) => (
              <ChapterRow chapter={chapter} slug={slug} />
            )}
          />
        ) : (
          <div className="divide-y divide-brand-surface">
            {filtered.map((chapter) => (
              <ChapterRow key={chapter.id} chapter={chapter} slug={slug} />
            ))}
          </div>
        )}
        {filtered.length === 0 && (
          <p className="p-6 text-center text-brand-text-muted">No chapters found.</p>
        )}
      </div>
    </div>
  );
}

function ChapterRow({ chapter, slug }: { chapter: ChapterListItem; slug: string }) {
  return (
    <Link
      href={`/comics/${slug}/chapter/${chapter.number}`}
      className="flex items-center justify-between px-4 py-3 hover:bg-brand-card-hover transition-colors group"
    >
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-white group-hover:text-brand-purple-light transition-colors">
          Chapter {chapter.number}
        </span>
        {chapter.title && (
          <span className="text-sm text-brand-text-secondary ml-2 truncate">
            - {chapter.title}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4 text-xs text-brand-text-muted flex-shrink-0 ml-4">
        <span>{formatViews(chapter.views)} views</span>
        <span>{formatDistanceToNow(new Date(chapter.publishedAt), { addSuffix: true })}</span>
      </div>
    </Link>
  );
}
