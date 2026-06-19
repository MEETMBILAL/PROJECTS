"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { ComicCard } from "@/components/comics/ComicCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { ComicListItem } from "@/types";
import { Button } from "@/components/ui/button";

interface ComicGridProps {
  initialComics: ComicListItem[];
  initialHasMore?: boolean;
  fetchUrl?: string;
  showChapters?: boolean;
  badge?: "NEW" | "END" | "HOT";
}

export function ComicGrid({
  initialComics,
  initialHasMore = false,
  fetchUrl,
  showChapters = false,
  badge,
}: ComicGridProps) {
  const [comics, setComics] = useState(initialComics);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (!fetchUrl || loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`${fetchUrl}&page=${nextPage}`);
      const data = await res.json();
      setComics((prev) => [...prev, ...data.comics]);
      setPage(nextPage);
      setHasMore(data.pagination?.hasMore ?? false);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [fetchUrl, loading, hasMore, page]);

  useEffect(() => {
    if (!fetchUrl) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );
    const el = observerRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, fetchUrl]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {comics.map((comic) => (
          <ComicCard
            key={comic.id}
            comic={comic}
            showChapters={showChapters}
            badge={badge}
          />
        ))}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-cover w-full rounded-cover bg-brand-card" />
          ))}
      </div>

      {hasMore && fetchUrl && (
        <div ref={observerRef} className="mt-8 flex justify-center">
          <Button
            onClick={loadMore}
            disabled={loading}
            variant="outline"
            className="border-brand-purple text-brand-purple-light hover:bg-brand-purple/10"
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </>
  );
}
