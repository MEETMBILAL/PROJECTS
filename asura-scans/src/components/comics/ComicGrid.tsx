import { ComicCard } from "@/components/comics/ComicCard";
import type { ComicListItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ComicGridProps {
  comics: ComicListItem[];
  badge?: "NEW" | "END" | "HOT";
  className?: string;
}

export function ComicGrid({ comics, badge, className }: ComicGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4",
        className
      )}
    >
      {comics.map((comic) => (
        <ComicCard key={comic.id} comic={comic} badge={badge} />
      ))}
    </div>
  );
}
