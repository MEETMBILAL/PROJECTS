import Link from "next/link";
import { ComicCard } from "@/components/comics/ComicCard";
import { formatRelativeTime } from "@/lib/utils";
import type { ComicListItem } from "@/types";

interface LatestUpdatesGridProps {
  comics: ComicListItem[];
}

export function LatestUpdatesGrid({ comics }: LatestUpdatesGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
      {comics.map((comic) => (
        <div
          key={comic.id}
          className="group overflow-hidden rounded-cover border border-transparent bg-brand-card transition-all duration-150 ease-in-out hover:scale-[1.03] hover:border-brand-purple hover:shadow-[0_0_12px_rgba(145,63,226,0.4)]"
        >
          <ComicCard comic={comic} />
          {comic.chapters && comic.chapters.length > 0 && (
            <div className="space-y-1 border-t border-brand-surface px-3 pb-3">
              {comic.chapters.slice(0, 3).map((ch) => (
                <Link
                  key={ch.id}
                  href={`/comics/${comic.slug}/chapter/${ch.number}`}
                  className="flex items-center justify-between text-xs text-brand-text-secondary hover:text-brand-purple-light"
                >
                  <span className="truncate">
                    Ch. {ch.number}
                    {ch.title ? `: ${ch.title}` : ""}
                  </span>
                  <span className="ml-2 shrink-0 text-brand-muted">
                    {formatRelativeTime(ch.publishedAt)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
