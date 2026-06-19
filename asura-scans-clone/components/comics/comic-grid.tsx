"use client";

import { useState } from "react";

import { ComicCard } from "@/components/comics/comic-card";
import { Button } from "@/components/ui/button";
import type { Comic } from "@/lib/types";

export function InfiniteComicGrid({ comics, pageSize = 18 }: { comics: Comic[]; pageSize?: number }) {
  const [visible, setVisible] = useState(pageSize);
  const shown = comics.slice(0, visible);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {shown.map((comic) => <ComicCard key={comic.id} comic={comic} />)}
      </div>
      {visible < comics.length ? (
        <div className="mt-8 flex justify-center">
          <Button onClick={() => setVisible((value) => value + pageSize)} className="bg-brand-primary hover:bg-brand-light">Load more comics</Button>
        </div>
      ) : null}
    </div>
  );
}
