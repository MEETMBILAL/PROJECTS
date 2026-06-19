import { ComicCard } from "@/components/comics/comic-card";
import type { ComicCardData } from "@/types";

/**
 * Trending Today — horizontally scrollable on mobile, 5-col grid on desktop,
 * with numbered rank overlays (1..n).
 */
export function TrendingRow({ comics }: { comics: ComicCardData[] }) {
  return (
    <>
      {/* Mobile: horizontal scroll */}
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-thin lg:hidden">
        {comics.map((comic, i) => (
          <ComicCard
            key={comic.id}
            comic={comic}
            rank={i + 1}
            className="w-36 shrink-0"
          />
        ))}
      </div>

      {/* Desktop: 5-col grid */}
      <div className="hidden gap-x-4 gap-y-6 lg:grid lg:grid-cols-5">
        {comics.map((comic, i) => (
          <ComicCard key={comic.id} comic={comic} rank={i + 1} />
        ))}
      </div>
    </>
  );
}
