"use client";

import * as React from "react";

import { ComicCard, ComicCardSkeleton } from "@/components/comic-card";
import { Button } from "@/components/ui/button";
import type { Comic, PaginatedComics } from "@/lib/types";

interface ComicGridProps {
  initial: PaginatedComics;
  /** Query string (without leading ?) used to fetch subsequent pages. */
  queryString: string;
  /** Auto-load more on scroll (infinite) vs. explicit load-more button. */
  infinite?: boolean;
}

/**
 * Responsive, paginated comic grid that fetches additional pages from
 * `/api/comics`. Supports both infinite scroll and a load-more button.
 */
export function ComicGrid({ initial, queryString, infinite = true }: ComicGridProps) {
  const [items, setItems] = React.useState<Comic[]>(initial.items);
  const [page, setPage] = React.useState(initial.page);
  const [hasMore, setHasMore] = React.useState(initial.hasMore);
  const [loading, setLoading] = React.useState(false);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  // Reset when the filters (queryString) change.
  React.useEffect(() => {
    setItems(initial.items);
    setPage(initial.page);
    setHasMore(initial.hasMore);
  }, [initial, queryString]);

  const loadMore = React.useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const next = page + 1;
      const sep = queryString ? "&" : "";
      const res = await fetch(`/api/comics?${queryString}${sep}page=${next}`);
      if (!res.ok) throw new Error("Failed to load");
      const data: PaginatedComics = await res.json();
      setItems((prev) => [...prev, ...data.items]);
      setPage(data.page);
      setHasMore(data.hasMore);
    } catch {
      // keep current state; user can retry via the button
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, queryString]);

  React.useEffect(() => {
    if (!infinite || !hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "600px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [infinite, hasMore, loadMore]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-brand-border py-20 text-center">
        <p className="text-lg font-semibold text-white">No comics found</p>
        <p className="text-sm text-brand-text-secondary">
          Try adjusting your filters or search term.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((comic, i) => (
          <ComicCard key={comic.id} comic={comic} priority={i < 6} />
        ))}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => <ComicCardSkeleton key={`s-${i}`} />)}
      </div>

      <div ref={sentinelRef} className="h-px w-full" aria-hidden />

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="secondary"
            size="lg"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? "Loading…" : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
