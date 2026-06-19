import { Calendar, Eye, Play, Share2, UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookmarkButton } from '@/components/comics/bookmark-button';
import { ChapterList } from '@/components/comics/chapter-list';
import { ComicCard } from '@/components/comics/comic-card';
import { GenreBadge } from '@/components/comics/genre-badge';
import { SectionHeading } from '@/components/comics/section-heading';
import { StarRating } from '@/components/comics/star-rating';
import { StatusBadge } from '@/components/comics/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getComicBySlug, getRelatedComics } from '@/lib/data';
import { compactNumber } from '@/lib/utils';

export default async function ComicDetailPage({ params }: { params: { slug: string } }) {
  const comic = await getComicBySlug(params.slug);
  if (!comic) notFound();
  const related = await getRelatedComics(comic);
  const firstChapter = [...comic.chapters].sort((a, b) => a.number - b.number)[0];

  return (
    <main className="pt-[60px]">
      <section className="relative overflow-hidden border-b border-brand-surface">
        <Image src={comic.bannerImage} alt="" fill priority sizes="100vw" className="object-cover opacity-25 blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 via-brand-dark/95 to-brand-dark" />
        <div className="container relative grid gap-8 py-10 md:grid-cols-[280px_1fr]">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-brand-surface bg-brand-card shadow-2xl"><Image src={comic.coverImage} alt={`${comic.title} cover`} fill sizes="280px" className="object-cover" /></div>
          <div className="space-y-5">
            <div className="space-y-3"><h1 className="text-4xl font-black text-white md:text-6xl">{comic.title}</h1><p className="text-brand-muted">{comic.altTitles.join(' · ')}</p></div>
            <div className="flex flex-wrap gap-2"><StatusBadge status={comic.status} /><Badge variant="secondary">{comic.type}</Badge><Badge variant="muted">{comic.releaseYear}</Badge></div>
            <div className="grid gap-3 text-sm text-brand-secondary sm:grid-cols-2 lg:grid-cols-4">
              <span className="flex items-center gap-2"><UserRound className="h-4 w-4 text-brand-accent" /> Author: {comic.author}</span>
              <span className="flex items-center gap-2"><UserRound className="h-4 w-4 text-brand-accent" /> Artist: {comic.artist}</span>
              <span className="flex items-center gap-2"><Eye className="h-4 w-4 text-brand-accent" /> {compactNumber(comic.totalViews)} views</span>
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-brand-accent" /> {comic.chapters.length} chapters</span>
            </div>
            <StarRating rating={comic.avgRating} count={comic.ratingCount} interactive />
            <div className="flex flex-wrap gap-3"><BookmarkButton comicId={comic.id} slug={comic.slug} /><Button asChild><Link href={`/comics/${comic.slug}/chapter/${firstChapter?.number ?? 1}`}><Play className="h-4 w-4 fill-white" /> Start Reading</Link></Button><Button variant="secondary" aria-label="Share comic"><Share2 className="h-4 w-4" /> Share</Button></div>
            <div className="flex flex-wrap gap-2">{comic.genres.map((genre) => <GenreBadge key={genre} genre={genre} />)}</div>
          </div>
        </div>
      </section>
      <section className="container grid gap-8 py-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <Card className="p-5"><h2 className="mb-3 text-xl font-bold text-white">Synopsis</h2><p className="leading-7 text-brand-secondary">{comic.synopsis}</p></Card>
          <div><SectionHeading title="Chapter List" /><ChapterList chapters={comic.chapters} slug={comic.slug} /></div>
        </div>
        <aside className="space-y-4"><SectionHeading title="Related Comics" /><div className="grid grid-cols-2 gap-4 lg:grid-cols-1">{related.slice(0, 6).map((item) => <ComicCard key={item.id} comic={item} />)}</div></aside>
      </section>
    </main>
  );
}
