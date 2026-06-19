"use client";

import { useEffect, useRef, useCallback } from "react";
import { ComicCard } from "./comic-card";
import { ComicCardSkeleton } from "./ui/skeleton";
import { ComicCardData } from "@/types";

interface ComicGridProps {
  comics: ComicCardData[];
  badge?: "NEW" | "END" | "HOT";
  hasMore?: boolean;
  loading?: boolean;
  onLoadMore?: () => void;
  className?: string;
}

export function ComicGrid({
  comics,
  badge,
  hasMore,
  loading,
  onLoadMore,
  className,
}: ComicGridProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading && onLoadMore) {
        onLoadMore();
      }
    },
    [hasMore, loading, onLoadMore]
  );

  useEffect(() => {
    if (!onLoadMore) return;
    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
    return () => observerRef.current?.disconnect();
  }, [handleObserver, onLoadMore]);

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
        {comics.map((comic) => (
          <ComicCard key={comic.id} comic={comic} badge={badge} />
        ))}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <ComicCardSkeleton key={`skel-${i}`} />
          ))}
      </div>
      {onLoadMore && <div ref={loadMoreRef} className="h-10" aria-hidden />}
    </div>
  );
}
