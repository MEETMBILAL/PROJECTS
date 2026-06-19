"use client";

import { useState } from "react";

import { ComicCard } from "@/components/comic-card";
import { Button } from "@/components/ui/button";
import type { Comic } from "@/lib/mock-data";

export function InfiniteComicGrid({ initialComics, pageSize = 24 }: { initialComics: Comic[]; pageSize?: number }) {
  const [visible, setVisible] = useState(pageSize);
  const shown = initialComics.slice(0, visible);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
        {shown.map((comic) => (
          <ComicCard key={comic.id} comic={comic} />
        ))}
      </div>
      {visible < initialComics.length && (
        <div className="mt-8 text-center">
          <Button variant="secondary" onClick={() => setVisible((count) => count + pageSize)}>
            Load more
          </Button>
        </div>
      )}
    </>
  );
}
