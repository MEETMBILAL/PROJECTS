import Image from "next/image";
import Link from "next/link";
import { StarRating } from "./star-rating";
import { Badge } from "./badge";
import { ComicCardData } from "@/types";
import { cn } from "@/lib/utils";

interface ComicCardProps {
  comic: ComicCardData;
  badge?: "NEW" | "END" | "HOT";
  className?: string;
}

export function ComicCard({ comic, badge, className }: ComicCardProps) {
  return (
    <Link
      href={`/comics/${comic.slug}`}
      className={cn(
        "group block rounded-cover bg-brand-card transition-all duration-150 ease-in-out hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(145,63,226,0.3)] hover:border hover:border-brand-purple/50",
        className
      )}
      aria-label={`Read ${comic.title}`}
    >
      <div className="relative aspect-cover overflow-hidden rounded-cover">
        <Image
          src={comic.coverImage}
          alt={comic.title}
          fill
          className="object-cover transition-transform duration-150 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 16vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/60 to-transparent opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
        {badge && (
          <div className="absolute top-2 right-2">
            <Badge
              variant={
                badge === "NEW" ? "new" : badge === "END" ? "completed" : "hot"
              }
            >
              {badge}
            </Badge>
          </div>
        )}
        <div className="absolute bottom-2 right-2">
          <StarRating rating={comic.avgRating} size="sm" />
        </div>
      </div>
      <div className="p-2">
        <h3 className="truncate text-sm font-medium text-brand-text-primary group-hover:text-brand-purple-light transition-colors">
          {comic.title}
        </h3>
        {comic.latestChapter !== undefined && (
          <p className="text-xs text-brand-text-secondary">
            Chapter {comic.latestChapter}
          </p>
        )}
      </div>
    </Link>
  );
}
