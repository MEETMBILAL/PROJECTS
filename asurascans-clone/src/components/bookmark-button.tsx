"use client";

import * as React from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { useBookmarkStore } from "@/store/use-bookmark-store";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps extends Omit<ButtonProps, "onClick"> {
  slug: string;
  title?: string;
  /** Full button with label vs. compact icon-only (for card hover). */
  iconOnly?: boolean;
}

/**
 * Bookmark toggle with optimistic UI. Updates the local store immediately and
 * syncs with the bookmarks API in the background (best-effort).
 */
export function BookmarkButton({
  slug,
  title,
  iconOnly = false,
  className,
  variant = "outline",
  ...props
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((s) => s.isBookmarked(slug));
  const toggle = useBookmarkStore((s) => s.toggle);

  const handleClick = async () => {
    const wasBookmarked = isBookmarked;
    toggle(slug); // optimistic
    toast.success(
      wasBookmarked ? "Removed from bookmarks" : "Added to bookmarks"
    );
    try {
      if (wasBookmarked) {
        await fetch(`/api/bookmarks/${encodeURIComponent(slug)}`, {
          method: "DELETE",
        });
      } else {
        await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });
      }
    } catch {
      // Anonymous/demo mode: local store already updated, ignore network errors.
    }
  };

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={isBookmarked}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md bg-black/70 text-white backdrop-blur transition-colors hover:bg-brand-purple",
          className
        )}
      >
        {isBookmarked ? (
          <BookmarkCheck className="h-4 w-4 text-brand-purple-light" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
      </button>
    );
  }

  return (
    <Button
      variant={isBookmarked ? "secondary" : variant}
      onClick={handleClick}
      aria-pressed={isBookmarked}
      className={className}
      {...props}
    >
      {isBookmarked ? (
        <>
          <BookmarkCheck className="h-4 w-4" /> Bookmarked
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4" /> Add to Bookmarks
        </>
      )}
    </Button>
  );
}
