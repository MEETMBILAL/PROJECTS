"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Trash2, BookMarked } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ComicCardSkeleton } from "@/components/comic/comic-card";
import { useBookmarkStore, type BookmarkEntry } from "@/store/bookmarks";
import { timeAgo, formatChapterNumber } from "@/lib/utils";

export default function BookmarksPage() {
  const { data: session } = useSession();
  const { list, remove } = useBookmarkStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const entries = mounted ? list() : [];

  if (!mounted) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ComicCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">My Bookmarks</h1>
          <p className="mt-1 text-sm text-brand-text-secondary">
            {entries.length} {entries.length === 1 ? "title" : "titles"} saved
          </p>
        </div>
      </div>

      {!session?.user && entries.length > 0 && (
        <div className="mb-6 rounded-lg border border-brand-purple/40 bg-brand-purple/10 p-4 text-sm text-brand-text-secondary">
          You&apos;re browsing bookmarks saved on this device.{" "}
          <Link href="/login" className="font-semibold text-brand-purple-light hover:underline">
            Sign in
          </Link>{" "}
          to sync them across devices.
        </div>
      )}

      {entries.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {entries.map((entry) => (
            <BookmarkCard key={entry.comic.id} entry={entry} onRemove={() => remove(entry.comic.slug)} />
          ))}
        </div>
      )}
    </div>
  );
}

function BookmarkCard({ entry, onRemove }: { entry: BookmarkEntry; onRemove: () => void }) {
  const { comic, lastReadChapter } = entry;
  const latest = comic.latestChapters[0]?.number ?? 0;
  const unread =
    lastReadChapter != null ? Math.max(0, Math.round(latest - lastReadChapter)) : null;

  return (
    <div className="group flex flex-col">
      <div className="relative overflow-hidden rounded-md border border-transparent bg-brand-card transition-all duration-150 hover:-translate-y-1 hover:border-brand-purple hover:shadow-purple-soft">
        <Link href={`/comics/${comic.slug}`} className="block">
          <div className="relative aspect-cover w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={comic.coverImage}
              alt={comic.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 backdrop-blur-sm">
              <Star className="h-3 w-3 text-brand-gold" fill="#FFD700" />
              <span className="text-xs font-bold text-white">{comic.avgRating.toFixed(1)}</span>
            </div>
            {unread != null && unread > 0 && (
              <Badge variant="hot" className="absolute right-1.5 top-1.5 px-1.5 py-0 text-[10px] font-bold">
                +{unread}
              </Badge>
            )}
          </div>
        </Link>
        <button
          onClick={onRemove}
          aria-label={`Remove ${comic.title} from bookmarks`}
          className="absolute left-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-md bg-black/60 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-brand-hot group-hover:opacity-100 focus-glow"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-2 flex flex-col gap-1">
        <Link
          href={`/comics/${comic.slug}`}
          className="line-clamp-2 text-sm font-semibold leading-snug text-white transition-colors hover:text-brand-purple-light"
        >
          {comic.title}
        </Link>
        <p className="text-xs text-brand-text-muted">
          {lastReadChapter != null ? (
            <>Read Ch. {formatChapterNumber(lastReadChapter)} · Latest {formatChapterNumber(latest)}</>
          ) : (
            <>Latest Ch. {formatChapterNumber(latest)}</>
          )}
        </p>
        {comic.latestChapters[0] && (
          <Link
            href={`/comics/${comic.slug}/chapter/${comic.latestChapters[0].number}`}
            className="mt-0.5 text-xs font-medium text-brand-purple-light hover:underline"
          >
            {lastReadChapter != null && lastReadChapter < latest ? "Continue reading" : "Read latest"}
            <span className="ml-1 text-brand-text-muted">{timeAgo(comic.latestChapters[0].publishedAt)}</span>
          </Link>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-brand-surface py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-purple/15">
        <BookMarked className="h-8 w-8 text-brand-purple-light" />
      </div>
      <div>
        <p className="text-lg font-semibold text-white">No bookmarks yet</p>
        <p className="mt-1 text-sm text-brand-text-secondary">
          Start building your library by bookmarking comics you love.
        </p>
      </div>
      <Button asChild size="lg">
        <Link href="/browse">Browse Comics</Link>
      </Button>
    </div>
  );
}
