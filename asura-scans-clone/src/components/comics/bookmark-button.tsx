"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useBookmarkStore } from "@/store/bookmark-store";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  comicId: string;
  initialBookmarked?: boolean;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  withLabel?: boolean;
}

export function BookmarkButton({
  comicId,
  initialBookmarked = false,
  variant = "outline",
  size = "default",
  className,
  withLabel = true,
}: BookmarkButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { bookmarkedIds, add, remove } = useBookmarkStore();
  const [pending, setPending] = React.useState(false);
  const [localFallback, setLocalFallback] = React.useState(initialBookmarked);

  // store is the source of truth once hydrated; fall back to the SSR value
  const bookmarked = bookmarkedIds.has(comicId) || localFallback;

  React.useEffect(() => {
    if (initialBookmarked) add(comicId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggle() {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    if (pending) return;
    setPending(true);

    const wasBookmarked = bookmarked;
    // optimistic update
    if (wasBookmarked) {
      remove(comicId);
      setLocalFallback(false);
    } else {
      add(comicId);
      setLocalFallback(true);
    }

    try {
      const res = wasBookmarked
        ? await fetch(`/api/bookmarks/${comicId}`, { method: "DELETE" })
        : await fetch("/api/bookmarks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comicId }),
          });
      if (!res.ok) throw new Error("request failed");
    } catch {
      // revert on failure
      if (wasBookmarked) {
        add(comicId);
        setLocalFallback(true);
      } else {
        remove(comicId);
        setLocalFallback(false);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant={bookmarked ? "secondary" : variant}
      size={size}
      onClick={toggle}
      disabled={pending}
      aria-pressed={bookmarked}
      className={cn(className)}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : bookmarked ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {withLabel && (bookmarked ? "Bookmarked" : "Add to Bookmarks")}
    </Button>
  );
}
