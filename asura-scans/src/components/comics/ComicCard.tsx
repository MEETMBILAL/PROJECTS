import Image from "next/image";
import Link from "next/link";
import { RatingStars } from "@/components/comics/RatingStars";
import { Badge } from "@/components/ui/badge";
import type { ComicListItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ComicCardProps {
  comic: ComicListItem;
  badge?: "NEW" | "END" | "HOT";
  className?: string;
}

export function ComicCard({ comic, badge, className }: ComicCardProps) {
  return (
    <Link
      href={`/comics/${comic.slug}`}
      className={cn(
        "group block rounded-cover overflow-hidden bg-brand-card border border-transparent card-hover",
        className
      )}
      aria-label={`Read ${comic.title}`}
    >
      <div className="relative">
        <Image
          src={comic.coverImage}
          alt={comic.title}
          width={300}
          height={400}
          className="comic-cover group-hover:brightness-75 transition-all duration-150"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
        {badge && (
          <Badge
            variant={badge === "NEW" ? "new" : badge === "HOT" ? "hot" : "completed"}
            className="absolute top-2 right-2"
          >
            {badge}
          </Badge>
        )}
        {comic.latestChapter && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-xs text-white">Ch. {comic.latestChapter.number}</p>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-brand-purple-light transition-colors">
          {comic.title}
        </h3>
        <div className="mt-1 flex items-center justify-between">
          <RatingStars rating={comic.avgRating} size="sm" />
        </div>
      </div>
    </Link>
  );
}
