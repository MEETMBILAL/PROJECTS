"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBookmarkStore } from "@/store/bookmarks";
import { toast } from "@/components/ui/toaster";
import type { ComicCardDTO } from "@/lib/types";

interface BookmarkButtonProps {
  comic: ComicCardDTO;
  variant?: "button" | "icon";
  className?: string;
}

export function BookmarkButton({ comic, variant = "button", className }: BookmarkButtonProps) {
  const { data: session } = useSession();
  const { isBookmarked, toggle } = useBookmarkStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const active = mounted && isBookmarked(comic.slug);

  const handleToggle = async () => {
    const nowBookmarked = toggle(comic); // optimistic
    toast({
      title: nowBookmarked ? "Added to bookmarks" : "Removed from bookmarks",
      description: comic.title,
      variant: nowBookmarked ? "success" : "default",
    });

    // Best-effort server sync when authenticated.
    if (session?.user) {
      try {
        if (nowBookmarked) {
          await fetch("/api/bookmarks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comicId: comic.id }),
          });
        } else {
          await fetch(`/api/bookmarks/${comic.id}`, { method: "DELETE" });
        }
      } catch {
        /* local store remains the source of truth in demo mode */
      }
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleToggle}
        aria-label={active ? "Remove bookmark" : "Add bookmark"}
        aria-pressed={active}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-brand-purple focus-glow",
          className,
        )}
      >
        {active ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
      </button>
    );
  }

  return (
    <Button
      variant={active ? "default" : "outline"}
      onClick={handleToggle}
      aria-pressed={active}
      className={className}
    >
      {active ? <BookmarkCheck /> : <Bookmark />}
      {active ? "Bookmarked" : "Add to Bookmarks"}
    </Button>
  );
}
