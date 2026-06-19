"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  comicId: string;
  initialBookmarked?: boolean;
  bookmarkId?: string;
  className?: string;
}

export function BookmarkButton({
  comicId,
  initialBookmarked = false,
  bookmarkId,
  className,
}: BookmarkButtonProps) {
  const { data: session } = useSession();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [id, setId] = useState(bookmarkId);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!session) {
      window.location.href = "/auth/signin";
      return;
    }

    setLoading(true);
    const prev = bookmarked;
    setBookmarked(!bookmarked);

    try {
      if (prev && id) {
        await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
        setId(undefined);
      } else {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comicId }),
        });
        const data = await res.json();
        setId(data.id);
      }
    } catch {
      setBookmarked(prev);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={toggle}
      disabled={loading}
      className={cn("gap-2", className)}
      aria-label={bookmarked ? "Remove bookmark" : "Add to bookmarks"}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : bookmarked ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {bookmarked ? "Bookmarked" : "Add to Bookmarks"}
    </Button>
  );
}
