import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/comics/star-rating';
import type { ComicDTO } from '@/lib/types';
import { cn, formatRelativeTime } from '@/lib/utils';

export function ComicCard({ comic, rank, badge, showChapters = false, className }: { comic: ComicDTO; rank?: number; badge?: 'NEW' | 'END' | 'HOT'; showChapters?: boolean; className?: string }) {
  const latestChapter = comic.chapters[0];
  return (
    <article className={cn('group rounded-xl border border-transparent bg-brand-card transition-all duration-150 ease-in-out hover:-translate-y-1 hover:border-brand-primary/70 hover:bg-brand-cardHover hover:shadow-purple-glow', className)}>
      <Link href={`/comics/${comic.slug}`} className="focus-purple block rounded-xl" aria-label={`Open ${comic.title}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg bg-brand-surface">
          <Image src={comic.coverImage} alt={`${comic.title} cover`} fill sizes="(min-width: 1280px) 16vw, (min-width: 768px) 25vw, 50vw" className="object-cover transition-transform duration-150 ease-in-out group-hover:scale-[1.03]" />
          <div className="absolute inset-0 bg-card-purple opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
          {rank ? <div className="absolute left-2 top-2 rounded-md bg-black/75 px-2 py-1 text-sm font-black text-white ring-1 ring-white/10">#{rank}</div> : null}
          {badge ? <Badge variant={badge === 'NEW' ? 'new' : badge === 'END' ? 'completed' : 'hot'} className="absolute right-2 top-2">{badge}</Badge> : null}
          {latestChapter ? <div className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white">Chapter {latestChapter.number}</div> : null}
        </div>
        <div className="space-y-2 p-3">
          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-white">{comic.title}</h3>
          <StarRating rating={comic.avgRating} className="text-xs" />
        </div>
      </Link>
      {showChapters ? (
        <div className="space-y-2 border-t border-brand-surface px-3 pb-3 pt-2">
          {comic.chapters.slice(0, 3).map((chapter) => (
            <Link key={chapter.id} href={`/comics/${comic.slug}/chapter/${chapter.number}`} className="focus-purple flex items-center justify-between rounded-md text-xs text-brand-secondary transition-colors hover:text-white">
              <span className="truncate">{chapter.title}</span>
              <span className="ml-2 shrink-0 text-brand-muted">{formatRelativeTime(chapter.publishedAt)}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </article>
  );
}
