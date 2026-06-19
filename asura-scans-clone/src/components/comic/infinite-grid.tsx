"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { ComicGrid, ComicGridSkeleton } from "@/components/comic/comic-grid";
import { Button } from "@/components/ui/button";
import type { ComicCardData, PaginatedResponse } from "@/lib/types";

/**
 * Infinite-scroll comic grid. Fetches from /api/comics using the provided
 * query string, automatically loading more as the sentinel enters the viewport,
 * with a manual "Load more" fallback.
 */
export function InfiniteGrid({
  queryString,
  initial,
}: {
  /** Query string WITHOUT a `page` param, e.g. "status=ONGOING&sort=rating". */
  queryString: string;
  initial?: PaginatedResponse<ComicCardData> | null;
}) {
  const [items, setItems] = React.useState<ComicCardData[]>(initial?.items ?? []);
  const [page, setPage] = React.useState(initial?.page ?? 1);
  const [hasMore, setHasMore] = React.useState(initial?.hasMore ?? true);
  const [total, setTotal] = React.useState(initial?.total ?? 0);
  const [loading, setLoading] = React.useState(false);
  const [firstLoad, setFirstLoad] = React.useState(!initial);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  // Reset when the filter query changes.
  React.useEffect(() => {
    let active = true;
    setFirstLoad(true);
    setItems([]);
    setPage(1);
    setHasMore(true);
    (async () => {
      try {
        const res = await fetch(`/api/comics?${queryString}&page=1`);
        const data: PaginatedResponse<ComicCardData> = await res.json();
        if (!active) return;
        setItems(data.items);
        setPage(1);
        setHasMore(data.hasMore);
        setTotal(data.total);
      } catch {
        if (active) setHasMore(false);
      } finally {
        if (active) setFirstLoad(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [queryString]);

  const loadMore = React.useCallback(async () => {
    if (loading || !hasMore || firstLoad) return;
    setLoading(true);
    try {
      const next = page + 1;
      const res = await fetch(`/api/comics?${queryString}&page=${next}`);
      const data: PaginatedResponse<ComicCardData> = await res.json();
      setItems((prev) => [...prev, ...data.items]);
      setPage(next);
      setHasMore(data.hasMore);
      setTotal(data.total);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, firstLoad, page, queryString]);

  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "600px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  if (firstLoad) return <ComicGridSkeleton count={12} />;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-brand-surface py-20 text-center">
        <p className="text-lg font-semibold text-white">No comics found</p>
        <p className="text-sm text-brand-text-secondary">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-brand-text-muted">{total} titles</p>
      <ComicGrid comics={items} />
      <div ref={sentinelRef} className="h-px w-full" />
      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button variant="secondary" onClick={loadMore} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
