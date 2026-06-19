"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { ComicCardData } from "@/types";
import { cn } from "@/lib/utils";

interface LatestUpdateCardProps {
  comic: ComicCardData;
  className?: string;
}

export function LatestUpdateCard({ comic, className }: LatestUpdateCardProps) {
  return (
    <Link
      href={`/comics/${comic.slug}`}
      className={cn(
        "group flex gap-3 rounded-cover border border-brand-surface bg-brand-card p-3 card-hover-lift",
        className
      )}
    >
      <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-cover">
        <Image
          src={comic.coverImage}
          alt={comic.title}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-semibold text-brand-text group-hover:text-brand-purple-light transition-colors">
          {comic.title}
        </h3>
        <ul className="mt-2 space-y-1">
          {comic.recentChapters?.slice(0, 3).map((chapter) => (
            <li key={chapter.id}>
              <Link
                href={`/comics/${comic.slug}/chapter/${chapter.number}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-between text-xs hover:text-brand-purple-light transition-colors"
              >
                <span className="truncate text-brand-secondary">
                  Chapter {chapter.number}
                  {chapter.title ? ` - ${chapter.title}` : ""}
                </span>
                <span className="ml-2 shrink-0 text-brand-muted">
                  {formatDistanceToNow(new Date(chapter.publishedAt), {
                    addSuffix: true,
                  })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
