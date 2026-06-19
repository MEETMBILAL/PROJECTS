import { ComicCard } from "@/components/comics/comic-card";
import type { ComicCardData } from "@/types";

export function RelatedComics({ comics }: { comics: ComicCardData[] }) {
  if (comics.length === 0) return null;
  return (
    <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-thin">
      {comics.map((comic) => (
        <ComicCard
          key={comic.id}
          comic={comic}
          className="w-32 shrink-0 sm:w-36"
        />
      ))}
    </div>
  );
}
