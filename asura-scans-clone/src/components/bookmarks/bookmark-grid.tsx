"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, BookOpen, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { chapterLabel } from "@/lib/utils";
import type { BookmarkData } from "@/types";

export function BookmarkGrid({ initial }: { initial: BookmarkData[] }) {
  const [items, setItems] = React.useState(initial);
  const [removing, setRemoving] = React.useState<string | null>(null);

  async function remove(comicId: string) {
    setRemoving(comicId);
    const prev = items;
    setItems((list) => list.filter((b) => b.id !== comicId));
    try {
      const res = await fetch(`/api/bookmarks/${comicId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setItems(prev); // revert
    } finally {
      setRemoving(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-brand-surface py-24 text-center">
        <BookOpen className="mb-4 h-12 w-12 text-brand-text-muted" />
        <p className="text-lg font-semibold text-white">No bookmarks yet</p>
        <p className="mt-1 max-w-sm text-sm text-brand-text-secondary">
          Start bookmarking your favorite series and they&apos;ll show up here so you
          can pick up right where you left off.
        </p>
        <Button asChild className="mt-6">
          <Link href="/browse">Browse comics</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
      {items.map((b) => (
        <div key={b.id} className="group flex flex-col">
          <div className="relative overflow-hidden rounded-md ring-1 ring-brand-surface transition-all duration-150 group-hover:ring-brand-purple">
            <Link href={`/comics/${b.slug}`} className="block">
              <div className="relative aspect-cover w-full bg-brand-card">
                <Image
                  src={b.coverImage}
                  alt={b.title}
                  fill
                  sizes="(max-width: 640px) 45vw, 16vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                {b.unreadCount > 0 && (
                  <span className="absolute left-1.5 top-1.5">
                    <Badge variant="hot">{b.unreadCount} new</Badge>
                  </span>
                )}
                {b.ratingCount > 0 && (
                  <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-brand-gold">
                    <Star className="h-3 w-3" fill="currentColor" />
                    {b.avgRating.toFixed(1)}
                  </span>
                )}
              </div>
            </Link>
            <button
              onClick={() => remove(b.id)}
              disabled={removing === b.id}
              aria-label={`Remove ${b.title} from bookmarks`}
              className="absolute right-1.5 top-1.5 rounded-md bg-black/60 p-1.5 text-white opacity-0 transition-opacity duration-150 hover:bg-brand-hot focus-visible:opacity-100 group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <Link
            href={`/comics/${b.slug}`}
            className="mt-2 line-clamp-2 text-sm font-semibold leading-tight text-white hover:text-brand-purple-light"
          >
            {b.title}
          </Link>
          <div className="mt-1 text-xs text-brand-text-secondary">
            {b.lastReadChapter !== null ? (
              <span>Read: {chapterLabel(b.lastReadChapter)}</span>
            ) : (
              <span>Not started</span>
            )}
          </div>
          <div className="text-xs text-brand-text-muted">
            {b.latestChapterNumber !== null
              ? `Latest: ${chapterLabel(b.latestChapterNumber)}`
              : "No chapters"}
          </div>
          {b.latestChapterNumber !== null && (
            <Button asChild size="sm" variant="secondary" className="mt-2">
              <Link
                href={`/comics/${b.slug}/chapter/${b.lastReadChapter ?? b.latestChapterNumber}`}
              >
                {b.lastReadChapter !== null ? "Continue" : "Start reading"}
              </Link>
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
