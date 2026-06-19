"use client";

import { useState, useTransition } from "react";
import { ComicGrid } from "@/components/comic-grid";
import { Button } from "@/components/ui/button";
import type { Comic, ComicListResponse } from "@/types/comic";

type InfiniteComicGridProps = {
  initial: ComicListResponse;
  queryString: string;
};

export function InfiniteComicGrid({ initial, queryString }: InfiniteComicGridProps) {
  const [items, setItems] = useState<Comic[]>(initial.items);
  const [page, setPage] = useState(initial.page);
  const [hasMore, setHasMore] = useState(initial.hasMore);
  const [isPending, startTransition] = useTransition();

  function loadMore() {
    startTransition(async () => {
      const nextPage = page + 1;
      const separator = queryString ? "&" : "";
      const response = await fetch(`/api/comics?${queryString}${separator}page=${nextPage}`);
      const data = (await response.json()) as ComicListResponse;
      setItems((current) => [...current, ...data.items]);
      setPage(data.page);
      setHasMore(data.hasMore);
    });
  }

  return (
    <div className="space-y-8">
      <ComicGrid comics={items} />
      {hasMore && (
        <div className="flex justify-center">
          <Button onClick={loadMore} disabled={isPending}>
            {isPending ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}
