"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

export function BookmarkButton({ comicId, initialBookmarked = false }: { comicId: string; initialBookmarked?: boolean }) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    const next = !bookmarked;
    setBookmarked(next);
    startTransition(async () => {
      try {
        await fetch(next ? "/api/bookmarks" : `/api/bookmarks/${comicId}`, {
          method: next ? "POST" : "DELETE",
          headers: { "Content-Type": "application/json" },
          body: next ? JSON.stringify({ comicId }) : undefined,
        });
      } catch {
        setBookmarked(!next);
      }
    });
  };

  return (
    <Button variant="outline" onClick={toggle} disabled={pending} aria-pressed={bookmarked}>
      {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {bookmarked ? "Bookmarked" : "Add to Bookmarks"}
    </Button>
  );
}
