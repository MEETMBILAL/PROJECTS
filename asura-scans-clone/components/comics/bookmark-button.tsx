"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useBookmarkStore } from "@/store/bookmarks";

export function BookmarkButton({ comicId }: { comicId: string }) {
  const [pending, setPending] = useState(false);
  const bookmarked = useBookmarkStore((state) => state.has(comicId));
  const toggleLocal = useBookmarkStore((state) => state.toggleLocal);

  async function toggle() {
    setPending(true);
    toggleLocal(comicId);
    try {
      await fetch("/api/bookmarks", {
        method: bookmarked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comicId }),
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <Button disabled={pending} onClick={toggle} variant="outline" className="border-brand-primary text-brand-light hover:bg-brand-primary hover:text-white">
      <Bookmark className="mr-2 h-4 w-4" /> {bookmarked ? "Bookmarked" : "Add to Bookmarks"}
    </Button>
  );
}
