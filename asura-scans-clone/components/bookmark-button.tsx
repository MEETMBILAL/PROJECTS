"use client";

import { Bookmark, Check } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

type BookmarkButtonProps = {
  comicId: string;
  initiallyBookmarked?: boolean;
};

export function BookmarkButton({ comicId, initiallyBookmarked = false }: BookmarkButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [bookmarked, setBookmarked] = useState(initiallyBookmarked);

  function onClick() {
    setBookmarked((current) => !current);
    startTransition(async () => {
      await fetch(bookmarked ? `/api/bookmarks/${comicId}` : "/api/bookmarks", {
        method: bookmarked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: bookmarked ? undefined : JSON.stringify({ comicId })
      });
    });
  }

  return (
    <Button variant="outline" onClick={onClick} disabled={isPending} aria-pressed={bookmarked}>
      {bookmarked ? <Check className="h-4 w-4" aria-hidden /> : <Bookmark className="h-4 w-4" aria-hidden />}
      {bookmarked ? "Bookmarked" : "Add to Bookmarks"}
    </Button>
  );
}
