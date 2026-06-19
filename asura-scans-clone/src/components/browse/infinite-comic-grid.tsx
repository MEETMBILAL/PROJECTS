"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ComicCard, ComicCardSkeleton } from "@/components/comics/comic-card";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE } from "@/lib/constants";
import type { ComicCardData, PaginatedResult } from "@/types";

interface InfiniteComicGridProps {
  initial: PaginatedResult<ComicCardData>;
}

export function InfiniteComicGrid({ initial }: InfiniteComicGridProps) {
  const params = useSearchParams();
  const [items, setItems] = React.useState<ComicCardData[]>(initial.items);
  const [page, setPage] = React.useState(initial.page);
  const [hasMore, setHasMore] = React.useState(initial.hasMore);
  const [total, setTotal] = React.useState(initial.total);
  const [loading, setLoading] = React.useState(false);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  // Reset when filters change
  const queryKey = params.toString();
  React.useEffect(() => {
    setItems(initial.items);
    setPage(initial.page);
    setHasMore(initial.hasMore);
    setTotal(initial.total);
  }, [initial]);

  const loadMore = React.useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const next = page + 1;
      const p = new URLSearchParams(queryKey);
      p.set("page", String(next));
      p.set("pageSize", String(PAGE_SIZE));
      const res = await fetch(`/api/comics?${p.toString()}`);
      if (res.ok) {
        const data: PaginatedResult<ComicCardData> = await res.json();
        setItems((prev) => [...prev, ...data.items]);
        setPage(next);
        setHasMore(data.hasMore);
        setTotal(data.total);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, queryKey]);

  // Intersection observer for infinite scroll
  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-brand-surface py-20 text-center">
        <p className="text-lg font-semibold text-white">No comics found</p>
        <p className="mt-1 text-sm text-brand-text-secondary">
          Try adjusting or clearing your filters.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-brand-text-secondary">
        Showing {items.length} of {total} titles
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {items.map((comic) => (
          <ComicCard key={comic.id} comic={comic} />
        ))}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => <ComicCardSkeleton key={`s-${i}`} />)}
      </div>

      <div ref={sentinelRef} className="h-10" />

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <Button variant="secondary" onClick={loadMore} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </>
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
