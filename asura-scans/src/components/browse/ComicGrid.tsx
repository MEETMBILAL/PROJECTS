"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { ComicCard } from "@/components/comics/ComicCard";
import { ComicCardData } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

interface ComicGridProps {
  initialComics: ComicCardData[];
  initialHasMore: boolean;
  filters?: Record<string, string>;
}

export function ComicGrid({
  initialComics,
  initialHasMore,
  filters = {},
}: ComicGridProps) {
  const [comics, setComics] = useState(initialComics);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setComics(initialComics);
    setPage(1);
    setHasMore(initialHasMore);
  }, [initialComics, initialHasMore]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page + 1), ...filters });
      const res = await fetch(`/api/comics?${params}`);
      const data = await res.json();
      setComics((prev) => [...prev, ...data.data]);
      setPage((p) => p + 1);
      setHasMore(data.hasMore);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, filters]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );
    const el = observerRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [loadMore]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {comics.map((comic) => (
          <ComicCard key={comic.id} comic={comic} />
        ))}
      </div>

      <div ref={observerRef} className="flex justify-center py-8">
        {loading && <Loader2 className="h-6 w-6 animate-spin text-brand-purple" />}
        {!loading && hasMore && (
          <Button variant="outline" onClick={loadMore}>
            Load More
          </Button>
        )}
      </div>
    </>
  );
}

export function ComicGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-cover w-full" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </div>
      ))}
    </div>
  );
}
