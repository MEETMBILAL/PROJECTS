'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ComicCard } from '@/components/comics/comic-card';
import type { ComicDTO } from '@/lib/types';

export function InfiniteComicGrid({ comics, pageSize = 18 }: { comics: ComicDTO[]; pageSize?: number }) {
  const [visible, setVisible] = useState(pageSize);
  const items = useMemo(() => comics.slice(0, visible), [comics, visible]);
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((comic) => <ComicCard key={comic.id} comic={comic} />)}
      </div>
      {visible < comics.length ? <div className="flex justify-center"><Button onClick={() => setVisible((value) => value + pageSize)}>Load more</Button></div> : null}
    </div>
  );
}
