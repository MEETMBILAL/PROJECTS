import { ComicCard, ComicCardSkeleton } from "@/components/comic/comic-card";
import { cn } from "@/lib/utils";
import type { ComicCardData } from "@/lib/types";

export function ComicGrid({
  comics,
  showChapters = false,
  badge,
  className,
}: {
  comics: ComicCardData[];
  showChapters?: boolean;
  badge?: "new" | "end" | null;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6",
        className,
      )}
    >
      {comics.map((comic) => (
        <ComicCard
          key={comic.id}
          comic={comic}
          showChapters={showChapters}
          badge={badge}
          rank={comic.rank}
        />
      ))}
    </div>
  );
}

export function ComicGridSkeleton({
  count = 12,
  showChapters = false,
  className,
}: {
  count?: number;
  showChapters?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ComicCardSkeleton key={i} showChapters={showChapters} />
      ))}
    </div>
  );
}
