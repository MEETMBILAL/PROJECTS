import Link from "next/link";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, timeAgo, formatChapterNumber } from "@/lib/utils";
import type { ComicCardDTO } from "@/lib/types";

interface ComicCardProps {
  comic: ComicCardDTO;
  /** Rank number overlay (used by Trending). */
  rank?: number;
  /** Show the last-3-chapters list (used by Latest Updates). */
  showChapters?: boolean;
  className?: string;
  priority?: boolean;
}

export function ComicCard({
  comic,
  rank,
  showChapters = false,
  className,
}: ComicCardProps) {
  return (
    <div className={cn("group flex flex-col", className)}>
      <Link
        href={`/comics/${comic.slug}`}
        className="relative block overflow-hidden rounded-md border border-transparent bg-brand-card transition-all duration-150 ease-in-out hover:-translate-y-1 hover:border-brand-purple hover:shadow-purple-soft focus-glow"
      >
        <div className="relative aspect-cover w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={comic.coverImage}
            alt={comic.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"
          />

          {/* Purple gradient overlay on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-purple/40 via-transparent to-transparent opacity-0 transition-opacity duration-150 group-hover:opacity-100" />

          {/* Rank overlay */}
          {rank !== undefined && (
            <span className="absolute left-1.5 top-1.5 flex h-7 min-w-7 items-center justify-center rounded-md bg-black/70 px-1.5 text-sm font-extrabold text-white backdrop-blur-sm">
              {rank}
            </span>
          )}

          {/* Status badges */}
          <div className="absolute right-1.5 top-1.5 flex flex-col items-end gap-1">
            {comic.isNew && (
              <Badge variant="new" className="px-1.5 py-0 text-[10px] font-bold">
                NEW
              </Badge>
            )}
            {comic.isHot && (
              <Badge variant="hot" className="px-1.5 py-0 text-[10px] font-bold">
                HOT
              </Badge>
            )}
            {comic.status === "COMPLETED" && (
              <Badge variant="completed" className="px-1.5 py-0 text-[10px] font-bold">
                END
              </Badge>
            )}
          </div>

          {/* Rating badge */}
          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 backdrop-blur-sm">
            <Star className="h-3 w-3 text-brand-gold" fill="#FFD700" />
            <span className="text-xs font-bold text-white">{comic.avgRating.toFixed(1)}</span>
          </div>
        </div>
      </Link>

      <div className="mt-2 flex flex-col gap-1">
        <Link
          href={`/comics/${comic.slug}`}
          className="line-clamp-2 text-sm font-semibold leading-snug text-white transition-colors hover:text-brand-purple-light"
          title={comic.title}
        >
          {comic.title}
        </Link>

        {showChapters ? (
          <ul className="mt-0.5 flex flex-col gap-1">
            {comic.latestChapters.slice(0, 3).map((ch) => (
              <li key={ch.id}>
                <Link
                  href={`/comics/${comic.slug}/chapter/${ch.number}`}
                  className="flex items-center justify-between gap-2 rounded-sm px-1.5 py-1 text-xs text-brand-text-secondary transition-colors hover:bg-brand-card-hover hover:text-white"
                >
                  <span className="truncate">Ch. {formatChapterNumber(ch.number)}</span>
                  <span className="shrink-0 text-[11px] text-brand-text-muted">
                    {timeAgo(ch.publishedAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          comic.latestChapters[0] && (
            <Link
              href={`/comics/${comic.slug}/chapter/${comic.latestChapters[0].number}`}
              className="text-xs text-brand-text-secondary transition-colors hover:text-brand-purple-light"
            >
              Chapter {formatChapterNumber(comic.latestChapters[0].number)}
            </Link>
          )
        )}
      </div>
    </div>
  );
}

export function ComicCardSkeleton({ showChapters = false }: { showChapters?: boolean }) {
  return (
    <div className="flex flex-col">
      <div className="skeleton aspect-cover w-full rounded-md" />
      <div className="mt-2 flex flex-col gap-2">
        <div className="skeleton h-4 w-11/12 rounded" />
        {showChapters ? (
          <>
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-10/12 rounded" />
            <div className="skeleton h-3 w-9/12 rounded" />
          </>
        ) : (
          <div className="skeleton h-3 w-1/2 rounded" />
        )}
      </div>
    </div>
  );
}
