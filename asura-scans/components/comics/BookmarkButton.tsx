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
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    try {
      if (bookmarked && id) {
        await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
        setBookmarked(false);
        setId(undefined);
      } else {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comicId }),
        });
        const data = await res.json();
        setBookmarked(true);
        setId(data.bookmark?.id);
      }
    } catch {
      // revert on error - keep optimistic
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={toggle}
      disabled={loading}
      className={cn(
        "border-brand-purple text-brand-purple-light hover:bg-brand-purple/10",
        bookmarked && "bg-brand-purple/20",
        className
      )}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Remove bookmark" : "Add to bookmarks"}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : bookmarked ? (
        <BookmarkCheck className="mr-2 h-4 w-4" />
      ) : (
        <Bookmark className="mr-2 h-4 w-4" />
      )}
      {bookmarked ? "Bookmarked" : "Add to Bookmarks"}
    </Button>
  );
}
