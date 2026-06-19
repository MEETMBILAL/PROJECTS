"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useBookmarks } from "@/store/use-bookmarks";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps extends Omit<ButtonProps, "onClick"> {
  comicId: string;
  initialBookmarked?: boolean;
  showLabel?: boolean;
}

export function BookmarkButton({
  comicId,
  initialBookmarked = false,
  showLabel = true,
  variant = "outline",
  size,
  className,
  ...props
}: BookmarkButtonProps) {
  const { status } = useSession();
  const router = useRouter();
  const { has, add, remove, bookmarked } = useBookmarks();
  const [pending, setPending] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
    if (initialBookmarked) add(comicId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isOn = hydrated ? has(comicId) : initialBookmarked;
  void bookmarked; // subscribe to store updates

  async function toggle() {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=/comics`);
      return;
    }
    setPending(true);
    const next = !isOn;
    // optimistic
    if (next) add(comicId);
    else remove(comicId);
    try {
      if (next) {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comicId }),
        });
        if (!res.ok) throw new Error("failed");
      } else {
        const res = await fetch(`/api/bookmarks/${comicId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("failed");
      }
      router.refresh();
    } catch {
      // rollback
      if (next) remove(comicId);
      else add(comicId);
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant={isOn ? "default" : variant}
      size={size}
      onClick={toggle}
      disabled={pending}
      aria-pressed={isOn}
      className={cn(className)}
      {...props}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isOn ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {showLabel && (isOn ? "Bookmarked" : "Add to Bookmarks")}
    </Button>
  );
}
