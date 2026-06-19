import Image from "next/image";
import Link from "next/link";
import { Eye, Facebook, Play, Share2, Twitter } from "lucide-react";
import { notFound } from "next/navigation";

import { BookmarkButton } from "@/components/comics/bookmark-button";
import { ChapterList } from "@/components/comics/chapter-list";
import { ComicCard } from "@/components/comics/comic-card";
import { GenreBadge } from "@/components/comics/genre-badge";
import { RatingStars } from "@/components/comics/rating-stars";
import { StatusBadge } from "@/components/comics/status-badge";
import { SectionHeading } from "@/components/common/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCompactNumber } from "@/lib/format";
import { getComicBySlug, getRelatedComics } from "@/lib/mock-data";

export function generateMetadata({ params }: { params: { slug: string } }) {
  const comic = getComicBySlug(params.slug);
  return { title: comic?.title ?? "Comic" };
}

export default function ComicDetailPage({ params }: { params: { slug: string } }) {
  const comic = getComicBySlug(params.slug);
  if (!comic) notFound();
  const firstChapter = [...comic.chapters].sort((a, b) => a.number - b.number)[0];
  const related = getRelatedComics(comic);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-brand-surface">
        <Image src={comic.bannerImage} alt="" fill sizes="100vw" className="object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-background via-brand-background/90 to-black/60" />
        <div className="asura-container relative grid gap-8 py-10 lg:grid-cols-[300px_1fr]">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[300px] overflow-hidden rounded-lg border border-brand-surface shadow-purple-soft lg:mx-0">
            <Image src={comic.coverImage} alt={comic.title} fill priority sizes="300px" className="object-cover" />
          </div>
          <div className="flex flex-col justify-end">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={comic.status} />
              <Badge className="bg-brand-hover text-white">{comic.type}</Badge>
              <Badge className="bg-brand-primary text-white">{comic.releaseYear}</Badge>
            </div>
            <h1 className="mt-4 text-balance text-4xl font-black text-white lg:text-6xl">{comic.title}</h1>
            <p className="mt-2 text-sm text-brand-muted">Also known as: {comic.altTitles.join(", ")}</p>
            <div className="mt-5 grid gap-3 text-sm text-brand-secondary sm:grid-cols-2 lg:grid-cols-4">
              <p><span className="text-brand-muted">Author:</span> {comic.author}</p>
              <p><span className="text-brand-muted">Artist:</span> {comic.artist}</p>
              <p className="flex items-center gap-2"><Eye className="h-4 w-4 text-brand-light" /> {formatCompactNumber(comic.totalViews)} views</p>
              <p>{comic.chapterCount} chapters</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <RatingStars value={comic.avgRating} interactive />
              <span className="text-sm text-brand-secondary">{comic.avgRating.toFixed(1)} / 10 from {formatCompactNumber(comic.ratingCount)} votes</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <BookmarkButton comicId={comic.id} />
              <Button asChild className="bg-brand-primary hover:bg-brand-light"><Link href={`/comics/${comic.slug}/chapter/${firstChapter?.number ?? 1}`}><Play className="mr-2 h-4 w-4 fill-white" /> Start Reading</Link></Button>
              <Button variant="ghost" size="icon" aria-label="Share"><Share2 className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" aria-label="Share on Facebook"><Facebook className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" aria-label="Share on Twitter"><Twitter className="h-5 w-5" /></Button>
            </div>
          </div>
        </div>
      </section>

      <div className="asura-container space-y-10 py-10">
        <section className="rounded-xl border border-brand-surface bg-brand-card p-5">
          <div className="flex flex-wrap gap-2">{comic.genres.map((genre) => <GenreBadge key={genre.id} name={genre.name} slug={genre.slug} />)}</div>
          <Separator className="my-5 bg-brand-surface" />
          <h2 className="text-lg font-bold text-white">Synopsis</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-brand-secondary">{comic.synopsis}</p>
          <p className="mt-4 text-sm text-brand-muted">Total chapters: {comic.chapterCount}</p>
        </section>

        <section>
          <SectionHeading title="Chapter List" />
          <ChapterList slug={comic.slug} chapters={comic.chapters} />
        </section>

        <section>
          <SectionHeading title="Related Comics" />
          <div className="flex gap-4 overflow-x-auto pb-2">
            {related.map((item) => <div key={item.id} className="w-40 shrink-0"><ComicCard comic={item} compact /></div>)}
          </div>
        </section>
      </div>
    </div>
  );
}
