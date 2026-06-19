"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookmarkStore } from "@/store";

interface BookmarkButtonProps {
  comicId: string;
  comicSlug: string;
}

export function BookmarkButton({ comicId, comicSlug }: BookmarkButtonProps) {
  const { data: session } = useSession();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore();
  const [loading, setLoading] = useState(false);
  const bookmarked = isBookmarked(comicSlug);

  const toggle = async () => {
    if (!session) {
      window.location.href = "/auth/signin";
      return;
    }
    setLoading(true);
    try {
      if (bookmarked) {
        const res = await fetch(`/api/bookmarks?comicId=${comicId}`, {
          method: "DELETE",
        });
        if (res.ok) removeBookmark(comicSlug);
      } else {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comicId }),
        });
        if (res.ok) addBookmark(comicSlug);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={toggle}
      disabled={loading}
      aria-label={bookmarked ? "Remove bookmark" : "Add to bookmarks"}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : bookmarked ? (
        <BookmarkCheck className="h-4 w-4 mr-2" />
      ) : (
        <Bookmark className="h-4 w-4 mr-2" />
      )}
      {bookmarked ? "Bookmarked" : "Add to Bookmarks"}
    </Button>
  );
}

export function BookmarkInitializer({ slugs }: { slugs: string[] }) {
  const setBookmarked = useBookmarkStore((s) => s.setBookmarked);
  useEffect(() => {
    setBookmarked(slugs);
  }, [slugs, setBookmarked]);
  return null;
}
