"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface BookmarkButtonProps {
  comicId: string;
  initialBookmarked?: boolean;
  bookmarkId?: string;
}

export function BookmarkButton({
  comicId,
  initialBookmarked = false,
  bookmarkId,
}: BookmarkButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [id, setId] = useState(bookmarkId);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      if (bookmarked && id) {
        const res = await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
        if (res.ok) {
          setBookmarked(false);
          setId(undefined);
        }
      } else {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comicId }),
        });
        if (res.ok) {
          const data = await res.json();
          setBookmarked(true);
          setId(data.id);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={loading}
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
