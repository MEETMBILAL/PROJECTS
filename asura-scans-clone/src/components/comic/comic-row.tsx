import { ComicCard } from "@/components/comic/comic-card";
import type { ComicCardData } from "@/lib/types";

/**
 * Horizontally scrollable row of comic cards on small screens that becomes a
 * fixed multi-column grid on desktop. Used for "Trending Today" and "Related".
 */
export function ComicRow({
  comics,
  withRank = false,
  desktopCols = 5,
}: {
  comics: ComicCardData[];
  withRank?: boolean;
  desktopCols?: 5 | 6;
}) {
  const colClass = desktopCols === 6 ? "lg:grid-cols-6" : "lg:grid-cols-5";
  return (
    <>
      {/* Mobile / tablet: horizontal scroll */}
      <div className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 lg:hidden">
        {comics.map((comic, i) => (
          <div key={comic.id} className="w-36 shrink-0 snap-start sm:w-40">
            <ComicCard comic={comic} rank={withRank ? i + 1 : undefined} />
          </div>
        ))}
      </div>
      {/* Desktop: grid */}
      <div className={`hidden gap-4 lg:grid ${colClass}`}>
        {comics.map((comic, i) => (
          <ComicCard key={comic.id} comic={comic} rank={withRank ? i + 1 : undefined} />
        ))}
      </div>
    </>
  );
}
