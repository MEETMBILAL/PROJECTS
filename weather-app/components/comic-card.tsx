import Image from "next/image";
import Link from "next/link";
import { Eye, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Comic } from "@/lib/mock-data";
import { formatViews, relativeDate } from "@/lib/utils";

export function ComicCard({
  comic,
  rank,
  badge,
  compact = false,
}: {
  comic: Comic;
  rank?: number;
  badge?: "NEW" | "END" | "HOT";
  compact?: boolean;
}) {
  const latest = comic.chapters[0];
  const badgeVariant = badge === "NEW" ? "new" : badge === "END" ? "completed" : "hot";

  return (
    <Link
      href={`/comics/${comic.slug}`}
      className="group block rounded-lg border border-transparent bg-brand-card p-2 hover:-translate-y-1 hover:border-brand-primary/70 hover:bg-brand-cardHover hover:shadow-purple-card"
    >
      <div className="cover-aspect relative overflow-hidden rounded-lg">
        <Image
          src={comic.coverImage}
          alt={`${comic.title} cover`}
          fill
          sizes="(max-width: 768px) 45vw, (max-width: 1280px) 20vw, 14vw"
          className="object-cover transition-transform duration-150 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        {rank ? (
          <div className="absolute left-2 top-2 rounded-md bg-black/80 px-2 py-1 text-sm font-black text-white">#{rank}</div>
        ) : null}
        {badge ? (
          <Badge variant={badgeVariant} className="absolute right-2 top-2">
            {badge}
          </Badge>
        ) : null}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/75 px-2 py-1 text-xs font-bold text-white">
          <Star className="h-3.5 w-3.5 fill-brand-ratingGold text-brand-ratingGold" />
          {comic.avgRating.toFixed(1)}
        </div>
      </div>
      <div className="space-y-1 px-1 py-2">
        <h3 className="line-clamp-2 text-sm font-bold leading-5 text-white">{comic.title}</h3>
        {!compact && (
          <>
            <p className="text-xs font-semibold text-brand-accentLight">Chapter {latest?.number ?? 1}</p>
            <p className="flex items-center gap-1 text-xs text-brand-textMuted">
              <Eye className="h-3.5 w-3.5" />
              {formatViews(comic.totalViews)} views
            </p>
          </>
        )}
      </div>
    </Link>
  );
}

export function UpdateComicCard({ comic, badge }: { comic: Comic; badge?: "NEW" | "END" }) {
  return (
    <article className="group rounded-xl border border-brand-surface bg-brand-card p-3 hover:scale-[1.03] hover:border-brand-primary hover:shadow-purple-card">
      <div className="flex gap-3">
        <Link href={`/comics/${comic.slug}`} className="cover-aspect relative w-24 shrink-0 overflow-hidden rounded-lg">
          <Image src={comic.coverImage} alt={`${comic.title} cover`} fill sizes="96px" className="object-cover" />
          {badge ? (
            <Badge variant={badge === "NEW" ? "new" : "completed"} className="absolute left-1 top-1">
              {badge}
            </Badge>
          ) : null}
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/comics/${comic.slug}`} className="line-clamp-2 font-bold text-white hover:text-brand-accentLight">
            {comic.title}
          </Link>
          <div className="mt-2 space-y-1">
            {comic.chapters.slice(0, 3).map((chapter) => (
              <Link
                key={chapter.id}
                href={`/comics/${comic.slug}/chapter/${chapter.number}`}
                className="flex items-center justify-between gap-2 rounded-md px-2 py-1 text-xs text-brand-textSecondary hover:bg-brand-cardHover hover:text-white"
              >
                <span>Chapter {chapter.number}</span>
                <span className="shrink-0 text-brand-textMuted">{relativeDate(chapter.publishedAt)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
