import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./StarRating";
import { ComicCardData } from "@/types";
import { cn } from "@/lib/utils";

interface ComicCardProps {
  comic: ComicCardData;
  variant?: "default" | "trending" | "latest";
  className?: string;
}

export function ComicCard({
  comic,
  variant = "default",
  className,
}: ComicCardProps) {
  return (
    <Link
      href={`/comics/${comic.slug}`}
      className={cn(
        "group block transition-all duration-150 ease-in-out",
        variant === "latest" && "card-hover-lift rounded-cover border border-brand-surface bg-brand-card p-3",
        className
      )}
    >
      <div className="relative aspect-cover overflow-hidden rounded-cover">
        <Image
          src={comic.coverImage}
          alt={comic.title}
          fill
          className="object-cover transition-transform duration-150 ease-in-out group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
        />
        {comic.rank && (
          <div className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-brand-purple text-sm font-bold text-white shadow-lg">
            {comic.rank}
          </div>
        )}
        {comic.isNew && (
          <Badge variant="new" className="absolute right-2 top-2">
            NEW
          </Badge>
        )}
        {comic.status === "COMPLETED" && variant !== "trending" && (
          <Badge variant="completed" className="absolute right-2 top-2">
            END
          </Badge>
        )}
        {variant === "trending" && (
          <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/60 to-transparent opacity-0 transition-opacity duration-150 ease-in-out group-hover:opacity-100" />
        )}
        {variant === "default" && comic.latestChapter && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <StarRating rating={comic.avgRating} size="sm" />
          </div>
        )}
      </div>
      <div className={cn("mt-2", variant === "latest" && "mt-3")}>
        <h3 className="line-clamp-2 text-sm font-semibold text-brand-text group-hover:text-brand-purple-light transition-colors">
          {comic.title}
        </h3>
        {variant === "trending" && comic.latestChapter && (
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs text-brand-secondary">
              Chapter {comic.latestChapter}
            </span>
            <StarRating rating={comic.avgRating} size="sm" />
          </div>
        )}
        {variant === "default" && comic.latestChapter && (
          <p className="mt-1 text-xs text-brand-secondary">
            Chapter {comic.latestChapter}
          </p>
        )}
      </div>
    </Link>
  );
}
