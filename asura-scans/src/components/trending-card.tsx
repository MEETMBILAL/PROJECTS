import Image from "next/image";
import Link from "next/link";
import { StarRating } from "./star-rating";
import { TrendingComic } from "@/types";
import { cn } from "@/lib/utils";

interface TrendingCardProps {
  comic: TrendingComic;
  className?: string;
}

export function TrendingCard({ comic, className }: TrendingCardProps) {
  return (
    <Link
      href={`/comics/${comic.slug}`}
      className={cn(
        "group relative flex-shrink-0 w-[140px] sm:w-[160px] md:w-auto",
        className
      )}
      aria-label={`#${comic.rank} ${comic.title}`}
    >
      <div className="relative aspect-cover overflow-hidden rounded-cover bg-brand-card">
        <Image
          src={comic.coverImage}
          alt={comic.title}
          fill
          className="object-cover transition-transform duration-150 group-hover:scale-105"
          sizes="160px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
        <div className="absolute top-0 left-0 flex h-8 w-8 items-center justify-center bg-brand-purple text-white text-sm font-bold rounded-br-cover">
          {comic.rank}
        </div>
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <StarRating rating={comic.avgRating} size="sm" />
        </div>
      </div>
      <div className="mt-2 px-1">
        <h3 className="truncate text-xs sm:text-sm font-medium text-brand-text-primary group-hover:text-brand-purple-light transition-colors">
          {comic.title}
        </h3>
        {comic.latestChapter !== undefined && (
          <p className="text-xs text-brand-text-secondary">
            Chapter {comic.latestChapter}
          </p>
        )}
        <StarRating rating={comic.avgRating} size="sm" className="mt-1 md:hidden" />
      </div>
    </Link>
  );
}
