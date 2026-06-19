import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ComicCardData } from "@/types";
import { cn } from "@/lib/utils";

interface LatestUpdateCardProps {
  comic: ComicCardData;
  className?: string;
}

export function LatestUpdateCard({ comic, className }: LatestUpdateCardProps) {
  const chapters = comic.latestChapters ?? [];

  return (
    <div
      className={cn(
        "group flex gap-3 rounded-cover bg-brand-card p-3 transition-all duration-150 ease-in-out hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(145,63,226,0.3)] hover:border hover:border-brand-purple/50",
        className
      )}
    >
      <Link
        href={`/comics/${comic.slug}`}
        className="relative flex-shrink-0 w-20 aspect-cover overflow-hidden rounded-cover"
        aria-label={comic.title}
      >
        <Image
          src={comic.coverImage}
          alt={comic.title}
          fill
          className="object-cover"
          sizes="80px"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          href={`/comics/${comic.slug}`}
          className="block truncate text-sm font-medium text-brand-text-primary hover:text-brand-purple-light transition-colors"
        >
          {comic.title}
        </Link>
        <ul className="mt-2 space-y-1">
          {chapters.slice(0, 3).map((ch) => (
            <li key={ch.id}>
              <Link
                href={`/comics/${comic.slug}/chapter/${ch.number}`}
                className="flex items-center justify-between text-xs text-brand-text-secondary hover:text-brand-purple-light transition-colors"
              >
                <span className="truncate">
                  Chapter {ch.number}
                  {ch.title ? ` - ${ch.title}` : ""}
                </span>
                <span className="flex-shrink-0 ml-2 text-brand-muted">
                  {formatDistanceToNow(new Date(ch.publishedAt), {
                    addSuffix: true,
                  })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
