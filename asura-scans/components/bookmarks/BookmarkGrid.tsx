"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ComicStatus, ComicType } from "@prisma/client";

interface BookmarkItem {
  id: string;
  comicId: string;
  lastReadChapter: number | null;
  comic: {
    id: string;
    slug: string;
    title: string;
    coverImage: string;
    status: ComicStatus;
    type: ComicType;
    avgRating: number;
    ratingCount: number;
    totalViews: number;
    latestChapterNumber: number;
  };
}

interface BookmarkGridProps {
  items: BookmarkItem[];
}

export function BookmarkGrid({ items: initialItems }: BookmarkGridProps) {
  const [items, setItems] = useState(initialItems);

  const remove = async (id: string) => {
    try {
      await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      // ignore
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
      {items.map((item) => {
        const unread =
          item.lastReadChapter !== null
            ? Math.max(0, item.comic.latestChapterNumber - item.lastReadChapter)
            : item.comic.latestChapterNumber;

        return (
          <div key={item.id} className="group relative">
            <Link
              href={`/comics/${item.comic.slug}`}
              className="block overflow-hidden rounded-cover bg-brand-card transition-all duration-150 hover:scale-[1.03] hover:border-brand-purple hover:shadow-[0_0_12px_rgba(145,63,226,0.4)] border border-transparent"
            >
              <div className="relative aspect-cover w-full">
                <Image
                  src={item.comic.coverImage}
                  alt={item.comic.title}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                {unread > 0 && (
                  <Badge className="absolute right-2 top-2 bg-brand-badge-hot text-white">
                    {unread} new
                  </Badge>
                )}
              </div>
              <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-semibold text-brand-text-primary">
                  {item.comic.title}
                </h3>
                <p className="mt-1 text-xs text-brand-text-secondary">
                  {item.lastReadChapter
                    ? `Last read: Ch. ${item.lastReadChapter}`
                    : "Not started"}
                  {" · "}
                  Latest: Ch. {item.comic.latestChapterNumber}
                </p>
              </div>
            </Link>
            <button
              onClick={() => remove(item.id)}
              className="absolute right-2 top-2 hidden rounded-full bg-black/70 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-brand-badge-hot"
              aria-label="Remove bookmark"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
