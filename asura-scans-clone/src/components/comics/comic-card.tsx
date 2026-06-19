import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn, timeAgo, chapterLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { ComicCardData } from "@/types";

interface ComicCardProps {
  comic: ComicCardData;
  /** Rank number to show as an overlay (1-based), e.g. on the trending row. */
  rank?: number;
  /** Show the latest 3 chapter links beneath the card. */
  showChapters?: boolean;
  className?: string;
  priority?: boolean;
}

export function ComicCard({
  comic,
  rank,
  showChapters = false,
  className,
  priority = false,
}: ComicCardProps) {
  return (
    <div className={cn("group flex flex-col", className)}>
      <Link
        href={`/comics/${comic.slug}`}
        className="relative block overflow-hidden rounded-md ring-1 ring-brand-surface transition-all duration-150 ease-in-out group-hover:scale-[1.03] group-hover:shadow-purple-soft group-hover:ring-brand-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
        aria-label={comic.title}
      >
        <div className="relative aspect-cover w-full bg-brand-card">
          <Image
            src={comic.coverImage}
            alt={comic.title}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
            className="object-cover"
            priority={priority}
          />

          {/* gradient overlay for legibility + purple hover wash */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-brand-purple/0 transition-colors duration-150 group-hover:bg-brand-purple/20" />

          {/* rank overlay */}
          {rank !== undefined && (
            <span className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-br-md bg-black/70 text-lg font-bold text-white backdrop-blur-sm">
              {rank}
            </span>
          )}

          {/* badges */}
          <div className="absolute right-1.5 top-1.5 flex flex-col items-end gap-1">
            {comic.isNew && <Badge variant="new">NEW</Badge>}
            {comic.isHot && <Badge variant="hot">HOT</Badge>}
            {comic.status === "COMPLETED" && <Badge variant="completed">END</Badge>}
          </div>

          {/* rating */}
          {comic.ratingCount > 0 && (
            <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-brand-gold backdrop-blur-sm">
              <Star className="h-3 w-3" fill="currentColor" />
              {comic.avgRating.toFixed(1)}
            </span>
          )}
        </div>
      </Link>

      <Link
        href={`/comics/${comic.slug}`}
        className="mt-2 line-clamp-2 text-sm font-semibold leading-tight text-white transition-colors duration-150 hover:text-brand-purple-light"
      >
        {comic.title}
      </Link>

      {showChapters ? (
        <ul className="mt-1.5 space-y-1">
          {comic.latestChapters.slice(0, 3).map((ch) => (
            <li key={ch.id}>
              <Link
                href={`/comics/${comic.slug}/chapter/${ch.number}`}
                className="flex items-center justify-between gap-2 rounded-sm px-2 py-1 text-xs text-brand-text-secondary transition-colors duration-150 hover:bg-brand-card-hover hover:text-white"
              >
                <span className="truncate">
                  {chapterLabel(ch.number)}
                </span>
                <time className="shrink-0 text-brand-text-muted">
                  {timeAgo(ch.publishedAt)}
                </time>
              </Link>
            </li>
          ))}
          {comic.latestChapters.length === 0 && (
            <li className="px-2 py-1 text-xs text-brand-text-muted">No chapters yet</li>
          )}
        </ul>
      ) : (
        comic.latestChapters[0] && (
          <Link
            href={`/comics/${comic.slug}/chapter/${comic.latestChapters[0].number}`}
            className="mt-1 text-xs text-brand-text-secondary transition-colors hover:text-brand-purple-light"
          >
            {chapterLabel(comic.latestChapters[0].number)}
          </Link>
        )
      )}
    </div>
  );
}

export function ComicCardSkeleton({ showChapters = false }: { showChapters?: boolean }) {
  return (
    <div className="flex flex-col">
      <div className="aspect-cover w-full animate-pulse rounded-md bg-brand-card-hover" />
      <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-brand-card-hover" />
      {showChapters && (
        <div className="mt-2 space-y-1.5">
          <div className="h-3 w-full animate-pulse rounded bg-brand-card-hover" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-brand-card-hover" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-brand-card-hover" />
        </div>
      )}
    </div>
  );
}
