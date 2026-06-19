"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { cn, formatRating } from "@/lib/utils";
import type { ComicListItem } from "@/types";

interface ComicCardProps {
  comic: ComicListItem;
  rank?: number;
  badge?: "NEW" | "END" | "HOT";
  showChapters?: boolean;
  className?: string;
}

export function ComicCard({
  comic,
  rank,
  badge,
  showChapters = false,
  className,
}: ComicCardProps) {
  const latestChapter = comic.latestChapter ?? comic.chapters?.[0];

  return (
    <Link
      href={`/comics/${comic.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-cover bg-brand-card transition-all duration-150 ease-in-out",
        "hover:scale-[1.03] hover:border-brand-purple hover:shadow-[0_0_12px_rgba(145,63,226,0.4)]",
        "border border-transparent",
        className
      )}
      aria-label={`Read ${comic.title}`}
    >
      <div className="relative aspect-cover w-full overflow-hidden">
        <Image
          src={comic.coverImage}
          alt={comic.title}
          fill
          className="object-cover transition-transform duration-150 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-150 group-hover:opacity-100" />

        {rank !== undefined && (
          <span
            className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-md bg-brand-purple text-sm font-bold text-white shadow-lg"
            aria-label={`Rank ${rank}`}
          >
            {rank}
          </span>
        )}

        {badge && (
          <span
            className={cn(
              "absolute right-2 top-2 rounded px-2 py-0.5 text-xs font-bold text-white",
              badge === "NEW" && "bg-brand-badge-new",
              badge === "END" && "bg-brand-badge-completed",
              badge === "HOT" && "bg-brand-badge-hot"
            )}
          >
            {badge}
          </span>
        )}

        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs text-brand-gold">
          <Star className="h-3 w-3 fill-brand-gold" aria-hidden="true" />
          <span>{formatRating(comic.avgRating)}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-brand-text-primary group-hover:text-brand-purple-light">
          {comic.title}
        </h3>

        {latestChapter && !showChapters && (
          <p className="text-xs text-brand-text-secondary">
            Ch. {latestChapter.number}
          </p>
        )}

        {showChapters && comic.chapters && comic.chapters.length > 0 && (
          <ul className="mt-1 space-y-1" aria-label="Recent chapters">
            {comic.chapters.slice(0, 3).map((ch) => (
              <li key={ch.id}>
                <Link
                  href={`/comics/${comic.slug}/chapter/${ch.number}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-between text-xs text-brand-text-secondary hover:text-brand-purple-light"
                >
                  <span className="truncate">Ch. {ch.number}{ch.title ? `: ${ch.title}` : ""}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
