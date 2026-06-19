import { ComicCard } from "@/components/comic-card";
import type { Comic } from "@/types/comic";

type ComicGridProps = {
  comics: Comic[];
  variant?: "poster" | "update";
  badge?: "NEW" | "END" | "HOT";
};

export function ComicGrid({ comics, variant = "poster", badge }: ComicGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {comics.map((comic) => (
        <ComicCard key={comic.id} comic={comic} variant={variant} badge={badge} />
      ))}
    </div>
  );
}
