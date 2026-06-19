"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { ComicCard, ComicCardSkeleton } from "./comic-card";
import { Button } from "@/components/ui/button";
import type { ComicCardDTO, ComicFilters } from "@/lib/types";

interface ComicGridProps {
  initialComics: ComicCardDTO[];
  initialHasMore: boolean;
  filters: ComicFilters;
  /** "scroll" = IntersectionObserver auto-load, "button" = load more button. */
  loadMode?: "scroll" | "button";
}

function buildQuery(filters: ComicFilters, page: number): string {
  const params = new URLSearchParams();
  if (filters.genres?.length) params.set("genres", filters.genres.join(","));
  if (filters.status) params.set("status", filters.status);
  if (filters.type) params.set("type", filters.type);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.search) params.set("q", filters.search);
  params.set("page", String(page));
  return params.toString();
}

export function ComicGrid({
  initialComics,
  initialHasMore,
  filters,
  loadMode = "scroll",
}: ComicGridProps) {
  const [comics, setComics] = useState(initialComics);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset when filters change.
  useEffect(() => {
    setComics(initialComics);
    setPage(1);
    setHasMore(initialHasMore);
  }, [initialComics, initialHasMore]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const next = page + 1;
      const res = await fetch(`/api/comics?${buildQuery(filters, next)}`);
      const data = await res.json();
      setComics((prev) => [...prev, ...(data.comics ?? [])]);
      setHasMore(Boolean(data.hasMore));
      setPage(next);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, filters]);

  useEffect(() => {
    if (loadMode !== "scroll") return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "600px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, loadMode]);

  if (comics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-brand-surface py-20 text-center">
        <p className="text-lg font-semibold text-white">No comics found</p>
        <p className="text-sm text-brand-text-secondary">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {comics.map((comic) => (
          <ComicCard key={comic.id} comic={comic} />
        ))}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => <ComicCardSkeleton key={`s-${i}`} />)}
      </div>

      {hasMore && loadMode === "button" && (
        <div className="mt-8 flex justify-center">
          <Button onClick={loadMore} disabled={loading} variant="secondary" size="lg">
            {loading && <Loader2 className="animate-spin" />}
            Load more
          </Button>
        </div>
      )}

      {hasMore && loadMode === "scroll" && <div ref={sentinelRef} className="h-10" />}

      {!hasMore && (
        <p className="mt-8 text-center text-sm text-brand-text-muted">
          You&apos;ve reached the end.
        </p>
      )}
    </div>
  );
}
