import Image from "next/image";
import Link from "next/link";
import { Eye, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Comic } from "@/lib/types";
import { cn, formatCompact, timeAgo } from "@/lib/utils";

interface ComicCardProps {
  comic: Comic;
  /** Rank number to overlay in the top-left corner (used in Trending). */
  rank?: number;
  /** Show the last few chapters with timestamps (used in Latest Updates). */
  showChapters?: boolean;
  priority?: boolean;
  className?: string;
}

function CoverBadge({ comic }: { comic: Comic }) {
  if (comic.isNew)
    return (
      <Badge variant="new" className="absolute left-2 top-2 z-10 shadow">
        NEW
      </Badge>
    );
  if (comic.status === "COMPLETED")
    return (
      <Badge variant="completed" className="absolute left-2 top-2 z-10 shadow">
        END
      </Badge>
    );
  if (comic.isHot)
    return (
      <Badge variant="hot" className="absolute left-2 top-2 z-10 shadow">
        HOT
      </Badge>
    );
  return null;
}

export function ComicCard({
  comic,
  rank,
  showChapters = false,
  priority = false,
  className,
}: ComicCardProps) {
  const latestChapters = comic.chapters.slice(0, 3);

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-md bg-brand-card transition-all duration-150 hover:-translate-y-0.5 hover:bg-brand-card-hover hover:shadow-purple-soft hover:ring-1 hover:ring-brand-purple/60",
        className
      )}
    >
      <Link
        href={`/comics/${comic.slug}`}
        className="relative block aspect-cover w-full overflow-hidden rounded-t-md"
        aria-label={comic.title}
      >
        <Image
          src={comic.coverImage}
          alt={comic.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          priority={priority}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {/* purple gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/60 via-transparent to-transparent opacity-0 transition-opacity duration-150 group-hover:opacity-100" />

        {rank !== undefined && (
          <span
            className="absolute left-1.5 top-1.5 z-10 flex h-7 min-w-7 items-center justify-center rounded-md bg-black/70 px-1.5 text-sm font-extrabold text-white ring-1 ring-brand-purple/50 backdrop-blur"
            aria-label={`Rank ${rank}`}
          >
            {rank}
          </span>
        )}

        {rank === undefined && <CoverBadge comic={comic} />}

        {/* rating chip */}
        <span className="absolute bottom-2 right-2 z-10 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-brand-gold backdrop-blur">
          <Star className="h-3 w-3 fill-brand-gold" />
          {comic.avgRating.toFixed(1)}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-2.5">
        <Link
          href={`/comics/${comic.slug}`}
          className="line-clamp-2 text-sm font-semibold leading-snug text-white transition-colors group-hover:text-brand-purple-light"
          title={comic.title}
        >
          {comic.title}
        </Link>

        {showChapters ? (
          <ul className="mt-0.5 flex flex-col gap-1">
            {latestChapters.map((ch) => (
              <li key={ch.id}>
                <Link
                  href={`/comics/${comic.slug}/chapter/${ch.number}`}
                  className="flex items-center justify-between rounded-sm px-1.5 py-1 text-xs text-brand-text-secondary transition-colors hover:bg-brand-surface hover:text-white"
                >
                  <span className="font-medium">Ch. {ch.number}</span>
                  <span className="text-[11px] text-brand-text-muted">
                    {timeAgo(ch.publishedAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-auto flex items-center justify-between text-xs text-brand-text-muted">
            <span className="font-medium text-brand-text-secondary">
              Ch. {comic.chapters[0]?.number ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatCompact(comic.totalViews)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ComicCardSkeleton({ showChapters = false }: { showChapters?: boolean }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-md bg-brand-card">
      <div className="aspect-cover w-full animate-pulse bg-brand-surface/60" />
      <div className="flex flex-col gap-2 p-2.5">
        <div className="h-4 w-4/5 animate-pulse rounded bg-brand-surface/60" />
        {showChapters ? (
          <>
            <div className="h-3 w-full animate-pulse rounded bg-brand-surface/40" />
            <div className="h-3 w-full animate-pulse rounded bg-brand-surface/40" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-brand-surface/40" />
          </>
        ) : (
          <div className="h-3 w-1/2 animate-pulse rounded bg-brand-surface/40" />
        )}
      </div>
    </div>
  );
}
