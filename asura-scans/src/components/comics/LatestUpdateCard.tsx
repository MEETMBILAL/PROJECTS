import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import type { LatestUpdateComic } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LatestUpdateCardProps {
  comic: LatestUpdateComic;
  className?: string;
}

export function LatestUpdateCard({ comic, className }: LatestUpdateCardProps) {
  return (
    <div
      className={cn(
        "flex gap-3 p-3 rounded-cover bg-brand-card border border-transparent card-hover",
        className
      )}
    >
      <Link href={`/comics/${comic.slug}`} className="flex-shrink-0">
        <Image
          src={comic.coverImage}
          alt={comic.title}
          width={80}
          height={107}
          className="comic-cover w-20"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/comics/${comic.slug}`}>
          <h3 className="text-sm font-semibold text-white line-clamp-2 hover:text-brand-purple-light transition-colors">
            {comic.title}
          </h3>
        </Link>
        <ul className="mt-2 space-y-1">
          {comic.recentChapters.map((chapter) => (
            <li key={chapter.id}>
              <Link
                href={`/comics/${comic.slug}/chapter/${chapter.number}`}
                className="flex items-center justify-between text-xs group"
              >
                <span className="text-brand-text-secondary group-hover:text-brand-purple-light transition-colors truncate">
                  Chapter {chapter.number}
                  {chapter.title ? ` - ${chapter.title}` : ""}
                </span>
                <span className="text-brand-text-muted flex-shrink-0 ml-2">
                  {formatDistanceToNow(new Date(chapter.publishedAt), { addSuffix: true })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
