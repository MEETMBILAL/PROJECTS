"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookmarkX, Compass } from "lucide-react";

import { ComicCardSkeleton } from "@/components/comic-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { useBookmarkStore } from "@/store/use-bookmark-store";
import type { Comic } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export default function BookmarksPage() {
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const remove = useBookmarkStore((s) => s.remove);
  const [comics, setComics] = React.useState<Comic[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => setHydrated(true), []);

  const slugs = React.useMemo(() => Object.keys(bookmarks), [bookmarks]);

  React.useEffect(() => {
    if (!hydrated) return;
    let active = true;
    setLoading(true);
    Promise.all(
      slugs.map((slug) =>
        fetch(`/api/comics/${encodeURIComponent(slug)}`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    ).then((results) => {
      if (active) {
        setComics(results.filter(Boolean) as Comic[]);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [slugs, hydrated]);

  const handleRemove = (slug: string) => {
    remove(slug);
    setComics((prev) => prev.filter((c) => c.slug !== slug));
    fetch(`/api/bookmarks/${encodeURIComponent(slug)}`, {
      method: "DELETE",
    }).catch(() => {});
    toast.success("Removed from bookmarks");
  };

  return (
    <div className="container max-w-screen-2xl space-y-6 py-6">
      <div>
        <h1 className="section-heading mb-1">My Bookmarks</h1>
        <p className="pl-3 text-sm text-brand-text-secondary">
          {slugs.length} {slugs.length === 1 ? "title" : "titles"} saved
        </p>
      </div>

      {hydrated && slugs.length === 0 ? (
        <EmptyState />
      ) : loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ComicCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {comics.map((comic) => {
            const lastRead = bookmarks[comic.slug] ?? 0;
            const latest = comic.chapters[0]?.number ?? 0;
            const unread = comic.chapters.filter((c) => c.number > lastRead).length;
            return (
              <div
                key={comic.id}
                className="group relative flex flex-col overflow-hidden rounded-md bg-brand-card transition-all duration-150 hover:bg-brand-card-hover hover:shadow-purple-soft"
              >
                <Link
                  href={`/comics/${comic.slug}`}
                  className="relative block aspect-cover overflow-hidden"
                >
                  <Image
                    src={comic.coverImage}
                    alt={comic.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 16vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  {unread > 0 && (
                    <Badge variant="new" className="absolute right-2 top-2 shadow">
                      {unread} new
                    </Badge>
                  )}
                </Link>
                <button
                  onClick={() => handleRemove(comic.slug)}
                  aria-label="Remove bookmark"
                  className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-md bg-black/70 text-white opacity-0 backdrop-blur transition-opacity hover:bg-brand-hot group-hover:opacity-100"
                >
                  <BookmarkX className="h-4 w-4" />
                </button>
                <div className="flex flex-col gap-1 p-2.5">
                  <Link
                    href={`/comics/${comic.slug}`}
                    className="line-clamp-2 text-sm font-semibold text-white hover:text-brand-purple-light"
                  >
                    {comic.title}
                  </Link>
                  <div className="flex items-center justify-between text-xs text-brand-text-muted">
                    <span>Read: Ch. {lastRead || "—"}</span>
                    <span>Latest: {latest}</span>
                  </div>
                  <Button asChild size="sm" className="mt-1 h-8">
                    <Link
                      href={`/comics/${comic.slug}/chapter/${
                        lastRead > 0 && unread > 0
                          ? Math.min(lastRead + 1, latest)
                          : latest
                      }`}
                    >
                      {lastRead > 0 ? "Continue" : "Read"}
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-brand-border py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-purple/15">
        <BookmarkX className="h-8 w-8 text-brand-purple-light" />
      </div>
      <div>
        <p className="text-lg font-semibold text-white">No bookmarks yet</p>
        <p className="mt-1 text-sm text-brand-text-secondary">
          Start saving your favorite series to keep track of them here.
        </p>
      </div>
      <Button asChild size="lg">
        <Link href="/browse">
          <Compass className="h-4 w-4" /> Browse Comics
        </Link>
      </Button>
    </div>
  );
}
