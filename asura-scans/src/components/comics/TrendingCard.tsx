import Image from "next/image";
import Link from "next/link";
import { RatingStars } from "@/components/comics/RatingStars";
import type { ComicListItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TrendingCardProps {
  comic: ComicListItem;
  rank: number;
  className?: string;
}

export function TrendingCard({ comic, rank, className }: TrendingCardProps) {
  return (
    <Link
      href={`/comics/${comic.slug}`}
      className={cn(
        "group relative flex-shrink-0 w-[160px] sm:w-auto rounded-cover overflow-hidden bg-brand-card border border-transparent card-hover",
        className
      )}
      aria-label={`#${rank} ${comic.title}`}
    >
      <div className="relative">
        <span className="absolute top-2 left-2 z-10 flex h-7 w-7 items-center justify-center rounded-md bg-brand-purple text-white text-sm font-bold shadow-lg">
          {rank}
        </span>
        <Image
          src={comic.coverImage}
          alt={comic.title}
          width={200}
          height={267}
          className="comic-cover group-hover:brightness-75 transition-all duration-150"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      </div>
      <div className="p-2.5">
        <h3 className="text-xs sm:text-sm font-semibold text-white line-clamp-2">{comic.title}</h3>
        {comic.latestChapter && (
          <p className="text-xs text-brand-text-secondary mt-0.5">
            Chapter {comic.latestChapter.number}
          </p>
        )}
        <RatingStars rating={comic.avgRating} size="sm" className="mt-1" />
      </div>
    </Link>
  );
}
