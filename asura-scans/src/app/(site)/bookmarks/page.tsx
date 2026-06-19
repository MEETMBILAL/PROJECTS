"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { BookmarkX } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/star-rating";
import { BookmarkWithComic } from "@/types";
import { ComicGridSkeleton } from "@/components/ui/skeleton";

export default function BookmarksPage() {
  const { data: session, status } = useSession();
  const [bookmarks, setBookmarks] = useState<BookmarkWithComic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      setLoading(false);
      return;
    }
    fetch("/api/bookmarks")
      .then((r) => r.json())
      .then((d) => setBookmarks(d.bookmarks ?? []))
      .finally(() => setLoading(false));
  }, [session, status]);

  const removeBookmark = async (id: string) => {
    await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SectionHeading>Bookmarks</SectionHeading>
        <ComicGridSkeleton />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Bookmarks</h1>
        <p className="text-brand-text-secondary mb-6">
          Sign in to save your favorite comics
        </p>
        <Link href="/auth/signin">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">No Bookmarks Yet</h1>
        <p className="text-brand-text-secondary mb-6">
          Start exploring and bookmark your favorite series
        </p>
        <Link href="/browse">
          <Button>Browse Comics</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionHeading>Bookmarks</SectionHeading>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
        {bookmarks.map((b) => (
          <div key={b.id} className="group relative">
            <Link href={`/comics/${b.comic.slug}`} className="block">
              <div className="relative aspect-cover rounded-cover overflow-hidden bg-brand-card">
                <Image
                  src={b.comic.coverImage}
                  alt={b.comic.title}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                {b.comic.unreadCount > 0 && (
                  <span className="absolute top-2 right-2 bg-brand-badge-hot text-white text-xs px-2 py-0.5 rounded-full">
                    {b.comic.unreadCount} new
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-sm font-medium text-white truncate">
                {b.comic.title}
              </h3>
              <p className="text-xs text-brand-text-secondary">
                Ch. {b.lastReadChapter ?? 0} / {b.comic.latestChapter}
              </p>
              <StarRating rating={b.comic.avgRating} size="sm" className="mt-1" />
            </Link>
            <button
              onClick={() => removeBookmark(b.id)}
              className="absolute top-2 left-2 p-1.5 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove bookmark"
            >
              <BookmarkX className="h-4 w-4 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
