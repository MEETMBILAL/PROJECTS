import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { relativeTime } from "@/lib/utils";
import type { Comic } from "@/types/comic";

type ComicCardProps = {
  comic: Comic;
  rank?: number;
  badge?: "NEW" | "END" | "HOT";
  variant?: "poster" | "update";
};

export function ComicCard({ comic, rank, badge, variant = "poster" }: ComicCardProps) {
  const latestChapters = comic.chapters.slice(0, 3);

  return (
    <article className="group min-w-0">
      <Link href={`/comics/${comic.slug}`} className="block" aria-label={`Open ${comic.title}`}>
        <div className="interactive-card relative overflow-hidden rounded-lg">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
            <Image
              src={comic.coverImage}
              alt={`${comic.title} cover`}
              fill
              sizes="(min-width: 1280px) 16vw, (min-width: 768px) 22vw, 45vw"
              className="object-cover transition-transform duration-150 ease-site group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-card-purple opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
            {rank && (
              <span className="absolute left-2 top-2 flex h-9 w-9 items-center justify-center rounded-md bg-black/80 text-lg font-black text-white ring-1 ring-white/10">
                {rank}
              </span>
            )}
            {badge && (
              <Badge
                variant={badge === "NEW" ? "new" : badge === "END" ? "completed" : "hot"}
                className="absolute right-2 top-2"
              >
                {badge}
              </Badge>
            )}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/75 px-2 py-1 text-xs font-semibold text-brand-rating">
              <Star className="h-3.5 w-3.5 fill-brand-rating" aria-hidden />
              {comic.avgRating.toFixed(1)}
            </div>
          </div>
        </div>
        <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-5 text-white transition-colors duration-150 group-hover:text-brand-accent">
          {comic.title}
        </h3>
      </Link>

      {variant === "poster" ? (
        <Link
          href={`/comics/${comic.slug}/chapter/${latestChapters[0]?.number ?? 1}`}
          className="mt-1 block text-xs text-brand-textSecondary transition-colors duration-150 hover:text-white"
        >
          Chapter {latestChapters[0]?.number ?? 1}
        </Link>
      ) : (
        <div className="mt-2 space-y-1.5">
          {latestChapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/comics/${comic.slug}/chapter/${chapter.number}`}
              className="flex items-center justify-between gap-2 rounded-md border border-transparent px-2 py-1 text-xs text-brand-textSecondary transition-colors duration-150 hover:border-brand-primary/40 hover:bg-brand-primary/10 hover:text-white"
            >
              <span>Ch. {chapter.number}</span>
              <time dateTime={chapter.publishedAt}>{relativeTime(chapter.publishedAt)}</time>
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
