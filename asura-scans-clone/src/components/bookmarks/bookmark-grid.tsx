"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatChapterNumber } from "@/lib/utils";
import type { ComicCardData } from "@/lib/types";

export function BookmarkGrid({ comics }: { comics: ComicCardData[] }) {
  const [list, setList] = React.useState(comics);
  const router = useRouter();
  const [removing, setRemoving] = React.useState<string | null>(null);

  async function remove(comicId: string) {
    setRemoving(comicId);
    const prev = list;
    setList((l) => l.filter((c) => c.id !== comicId));
    try {
      const res = await fetch(`/api/bookmarks/${comicId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setList(prev);
    } finally {
      setRemoving(null);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
      {list.map((comic) => (
        <div key={comic.id} className="group flex flex-col">
          <div className="relative overflow-hidden rounded-md ring-1 ring-transparent transition-all duration-150 group-hover:ring-brand-purple">
            <Link href={`/comics/${comic.slug}`} className="block">
              <div className="relative aspect-[3/4] w-full bg-brand-card">
                <Image
                  src={comic.coverImage}
                  alt={comic.title}
                  fill
                  sizes="(max-width: 640px) 45vw, 16vw"
                  className="object-cover"
                />
                {!!comic.unreadCount && comic.unreadCount > 0 && (
                  <Badge variant="hot" className="absolute left-2 top-2">
                    {comic.unreadCount} new
                  </Badge>
                )}
                <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-black/75 px-1.5 py-0.5 text-xs font-semibold text-white">
                  <Star className="h-3 w-3 fill-brand-gold text-brand-gold" />
                  {comic.avgRating.toFixed(1)}
                </span>
              </div>
            </Link>
            <button
              onClick={() => remove(comic.id)}
              disabled={removing === comic.id}
              aria-label="Remove bookmark"
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md bg-black/70 text-white opacity-0 transition-opacity hover:bg-brand-hot group-hover:opacity-100"
            >
              {removing === comic.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>

          <Link
            href={`/comics/${comic.slug}`}
            className="mt-2 line-clamp-2 text-sm font-semibold text-white hover:text-brand-purple-light"
          >
            {comic.title}
          </Link>
          <p className="mt-0.5 text-xs text-brand-text-muted">
            Read: Ch. {formatChapterNumber(comic.lastReadChapter ?? 0)} / {formatChapterNumber(comic.latestChapter ?? 0)}
          </p>
        </div>
      ))}
    </div>
  );
}
