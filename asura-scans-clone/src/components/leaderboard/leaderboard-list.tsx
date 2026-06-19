import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowDown, Minus, Eye, Star } from "lucide-react";
import { cn, formatCompact, formatChapterNumber } from "@/lib/utils";
import type { ComicCardData } from "@/lib/types";

export function LeaderboardList({ comics }: { comics: ComicCardData[] }) {
  if (comics.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-brand-surface py-16 text-center text-sm text-brand-text-secondary">
        No data available yet.
      </p>
    );
  }

  return (
    <ol className="divide-y divide-brand-surface overflow-hidden rounded-lg border border-brand-surface">
      {comics.map((comic, i) => {
        const rank = comic.rank ?? i + 1;
        const change = comic.rankChange ?? 0;
        return (
          <li key={comic.id}>
            <Link
              href={`/comics/${comic.slug}`}
              className="flex items-center gap-4 p-3 transition-colors hover:bg-brand-card-hover"
            >
              <span
                className={cn(
                  "w-8 shrink-0 text-center text-lg font-extrabold",
                  rank === 1 && "text-brand-gold",
                  rank === 2 && "text-brand-text-secondary",
                  rank === 3 && "text-amber-600",
                  rank > 3 && "text-brand-text-muted",
                )}
              >
                {rank}
              </span>

              <RankChange change={change} />

              <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded">
                <Image src={comic.coverImage} alt="" fill sizes="48px" className="object-cover" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{comic.title}</p>
                {comic.chapters?.[0] && (
                  <p className="text-xs text-brand-text-muted">
                    Latest Ch. {formatChapterNumber(comic.chapters[0].number)}
                  </p>
                )}
              </div>

              <div className="hidden items-center gap-1 text-sm text-brand-text-secondary sm:flex">
                <Star className="h-4 w-4 fill-brand-gold text-brand-gold" />
                {comic.avgRating.toFixed(1)}
              </div>
              <div className="flex items-center gap-1 text-sm text-brand-text-secondary">
                <Eye className="h-4 w-4" />
                {formatCompact(comic.totalViews)}
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

function RankChange({ change }: { change: number }) {
  if (change > 0)
    return (
      <span className="flex w-8 items-center justify-center text-xs font-semibold text-brand-new">
        <ArrowUp className="h-3.5 w-3.5" />
        {change}
      </span>
    );
  if (change < 0)
    return (
      <span className="flex w-8 items-center justify-center text-xs font-semibold text-brand-hot">
        <ArrowDown className="h-3.5 w-3.5" />
        {Math.abs(change)}
      </span>
    );
  return (
    <span className="flex w-8 items-center justify-center text-brand-text-muted">
      <Minus className="h-3.5 w-3.5" />
    </span>
  );
}
