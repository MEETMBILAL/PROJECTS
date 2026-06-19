use client';

import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { useBookmarkStore } from '@/hooks/use-bookmark-store';

export function BookmarkButton({ comicId, slug }: { comicId: string; slug: string }) {
  const storeHas = useBookmarkStore((state) => state.has);
  const storeToggle = useBookmarkStore((state) => state.toggle);
  const [bookmarked, setBookmarked] = useState(storeHas(slug));
  const [pending, startTransition] = useTransition();

  function onToggle() {
    const next = storeToggle(slug);
    setBookmarked(next);
    startTransition(async () => {
      await fetch('/api/bookmarks', {
        method: next ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comicId, slug }),
      }).catch(() => undefined);
    });
  }

  return (
    <Button variant="outline" onClick={onToggle} disabled={pending} aria-pressed={bookmarked}>
      {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {bookmarked ? 'Bookmarked' : 'Add to Bookmarks'}
    </Button>
  );
}
