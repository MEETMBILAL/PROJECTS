import { cn } from "@/lib/utils";
import { ComicCard, ComicCardSkeleton } from "@/components/comics/comic-card";
import type { ComicCardData } from "@/types";

interface ComicGridProps {
  comics: ComicCardData[];
  showChapters?: boolean;
  className?: string;
  /** Tailwind grid column classes; defaults to the home/browse responsive grid. */
  columns?: string;
}

const DEFAULT_COLUMNS =
  "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6";

export function ComicGrid({
  comics,
  showChapters = false,
  className,
  columns = DEFAULT_COLUMNS,
}: ComicGridProps) {
  return (
    <div className={cn("grid gap-x-4 gap-y-6", columns, className)}>
      {comics.map((comic) => (
        <ComicCard key={comic.id} comic={comic} showChapters={showChapters} />
      ))}
    </div>
  );
}

export function ComicGridSkeleton({
  count = 12,
  showChapters = false,
  columns = DEFAULT_COLUMNS,
}: {
  count?: number;
  showChapters?: boolean;
  columns?: string;
}) {
  return (
    <div className={cn("grid gap-x-4 gap-y-6", columns)}>
      {Array.from({ length: count }).map((_, i) => (
        <ComicCardSkeleton key={i} showChapters={showChapters} />
      ))}
    </div>
  );
}
