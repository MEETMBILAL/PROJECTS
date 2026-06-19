import Image from "next/image";
import Link from "next/link";
import { Star, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, timeAgo, formatCompact, formatChapterNumber } from "@/lib/utils";
import type { ComicCardData } from "@/lib/types";

interface ComicCardProps {
  comic: ComicCardData;
  /** Show numbered rank overlay (trending). */
  rank?: number;
  /** Show the "NEW" / "END" cover badge. */
  badge?: "new" | "end" | null;
  /** Show the latest 3 chapter links with timestamps (latest updates style). */
  showChapters?: boolean;
  className?: string;
}

export function ComicCard({ comic, rank, badge, showChapters = false, className }: ComicCardProps) {
  return (
    <div className={cn("group flex flex-col", className)}>
      <Link
        href={`/comics/${comic.slug}`}
        className="relative block overflow-hidden rounded-md ring-1 ring-transparent transition-all duration-150 ease-in-out group-hover:-translate-y-0.5 group-hover:scale-[1.03] group-hover:shadow-purple-soft group-hover:ring-brand-purple"
        aria-label={comic.title}
      >
        <div className="relative aspect-[3/4] w-full bg-brand-card">
          <Image
            src={comic.coverImage}
            alt={comic.title}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 16vw"
            className="object-cover transition-transform duration-300"
          />
          {/* Purple gradient overlay on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-purple/40 via-transparent to-transparent opacity-0 transition-opacity duration-150 group-hover:opacity-100" />

          {/* Rank overlay */}
          {rank != null && (
            <span className="absolute left-2 top-2 flex h-7 min-w-7 items-center justify-center rounded-md bg-black/70 px-1.5 text-sm font-bold text-white ring-1 ring-white/10">
              {rank}
            </span>
          )}

          {/* Status badge */}
          {badge === "new" && (
            <Badge variant="new" className="absolute right-2 top-2 shadow">
              NEW
            </Badge>
          )}
          {badge === "end" && (
            <Badge variant="completed" className="absolute right-2 top-2 shadow">
              END
            </Badge>
          )}

          {/* Rating chip */}
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-black/75 px-1.5 py-0.5 text-xs font-semibold text-white">
            <Star className="h-3 w-3 fill-brand-gold text-brand-gold" />
            {comic.avgRating.toFixed(1)}
          </span>
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-brand-text-secondary">
            <Eye className="h-3 w-3" />
            {formatCompact(comic.totalViews)}
          </span>
        </div>
      </Link>

      <div className="mt-2 flex flex-col">
        <Link
          href={`/comics/${comic.slug}`}
          className="line-clamp-2 text-sm font-semibold text-white transition-colors hover:text-brand-purple-light"
          title={comic.title}
        >
          {comic.title}
        </Link>

        {showChapters && comic.chapters && comic.chapters.length > 0 ? (
          <ul className="mt-1.5 space-y-1">
            {comic.chapters.slice(0, 3).map((ch) => (
              <li key={ch.id}>
                <Link
                  href={`/comics/${comic.slug}/chapter/${ch.number}`}
                  className="flex items-center justify-between gap-2 rounded-sm px-2 py-1 text-xs text-brand-text-secondary transition-colors hover:bg-brand-card-hover hover:text-white"
                >
                  <span className="truncate">Ch. {formatChapterNumber(ch.number)}</span>
                  <span className="shrink-0 text-[10px] text-brand-text-muted">
                    {timeAgo(ch.publishedAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          comic.chapters &&
          comic.chapters[0] && (
            <span className="mt-1 text-xs text-brand-text-secondary">
              Ch. {formatChapterNumber(comic.chapters[0].number)}
            </span>
          )
        )}
      </div>
    </div>
  );
}

export function ComicCardSkeleton({ showChapters = false }: { showChapters?: boolean }) {
  return (
    <div className="flex flex-col">
      <div className="aspect-[3/4] w-full animate-pulse rounded-md bg-brand-card" />
      <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-brand-card" />
      {showChapters && (
        <div className="mt-2 space-y-1.5">
          <div className="h-3 w-full animate-pulse rounded bg-brand-card" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-brand-card" />
        </div>
      )}
    </div>
  );
}
