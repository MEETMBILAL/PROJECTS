"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ComicCard } from "@/components/comics/ComicCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { ComicListItem } from "@/lib/types";

export function InfiniteComicGrid() {
  const searchParams = useSearchParams();
  const [comics, setComics] = useState<ComicListItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchComics = useCallback(
    async (pageNum: number, append = false) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", pageNum.toString());
      params.set("limit", "24");

      const res = await fetch(`/api/comics?${params.toString()}`);
      const data = await res.json();

      setComics((prev) => (append ? [...prev, ...data.data] : data.data));
      setHasMore(data.hasMore);
    },
    [searchParams]
  );

  useEffect(() => {
    setPage(1);
    setLoading(true);
    fetchComics(1).finally(() => setLoading(false));
  }, [fetchComics]);

  const loadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchComics(nextPage, true);
    setPage(nextPage);
    setLoadingMore(false);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-cover" />
        ))}
      </div>
    );
  }

  if (comics.length === 0) {
    return (
      <p className="text-center text-brand-text-muted py-12">
        No comics found matching your filters.
      </p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {comics.map((comic) => (
          <ComicCard key={comic.id} comic={comic} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button onClick={loadMore} disabled={loadingMore} variant="outline">
            {loadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
