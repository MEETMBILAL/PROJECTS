import Image from "next/image";
import Link from "next/link";
import { Eye, Facebook, Share2, Twitter } from "lucide-react";
import { notFound } from "next/navigation";

import { BookmarkButton } from "@/components/bookmark-button";
import { ChapterList } from "@/components/chapter-list";
import { ComicCard } from "@/components/comic-card";
import { GenreBadge } from "@/components/genre-badge";
import { SectionTitle } from "@/components/section-title";
import { StarRating } from "@/components/star-rating";
import { StatusBadge } from "@/components/status-badge";
import { Synopsis } from "@/components/synopsis";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getComicBySlug, getRelatedComics } from "@/lib/mock-data";
import { formatViews } from "@/lib/utils";

export function generateMetadata({ params }: { params: { slug: string } }) {
  const comic = getComicBySlug(params.slug);
  return {
    title: comic?.title ?? "Comic",
    description: comic?.synopsis,
  };
}

export default function ComicDetailPage({ params }: { params: { slug: string } }) {
  const comic = getComicBySlug(params.slug);
  if (!comic) notFound();
  const oldestChapter = comic.chapters.at(-1);
  const related = getRelatedComics(comic);

  return (
    <div className="container-shell space-y-10 py-10">
      <section className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <div className="cover-aspect relative overflow-hidden rounded-lg border border-brand-surface bg-brand-card">
          <Image src={comic.coverImage} alt={`${comic.title} cover`} fill priority sizes="300px" className="object-cover" />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">{comic.title}</h1>
            <p className="mt-2 text-sm text-brand-textMuted">{comic.altTitles.join(" • ")}</p>
          </div>

          <div className="grid gap-3 text-sm text-brand-textSecondary sm:grid-cols-2 xl:grid-cols-3">
            <Info label="Author" value={comic.author} />
            <Info label="Artist" value={comic.artist} />
            <Info label="Release Year" value={String(comic.releaseYear)} />
            <Info label="Views" value={formatViews(comic.totalViews)} icon={<Eye className="h-4 w-4" />} />
            <div className="flex items-center gap-2">
              <span className="text-brand-textMuted">Status</span>
              <StatusBadge status={comic.status} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-brand-textMuted">Type</span>
              <Badge variant="secondary">{comic.type}</Badge>
            </div>
          </div>

          <div className="rounded-xl border border-brand-surface bg-brand-card p-4">
            <div className="flex flex-wrap items-center gap-4">
              <StarRating value={comic.avgRating} size="md" />
              <span className="font-black text-white">{comic.avgRating.toFixed(1)} / 10</span>
              <span className="text-sm text-brand-textMuted">from {comic.ratingCount.toLocaleString()} votes</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <BookmarkButton comicId={comic.id} />
            <Button asChild>
              <Link href={`/comics/${comic.slug}/chapter/${oldestChapter?.number ?? 1}`}>Start Reading</Link>
            </Button>
            <Button variant="ghost" size="icon" aria-label="Share">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Share on Twitter">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Share on Facebook">
              <Facebook className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-6 rounded-xl border border-brand-surface bg-brand-card p-5">
            <div>
              <h2 className="mb-3 font-black text-white">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {comic.genres.map((genre) => (
                  <GenreBadge key={genre} genre={genre} />
                ))}
              </div>
            </div>
            <div>
              <h2 className="mb-3 font-black text-white">Synopsis</h2>
              <Synopsis text={comic.synopsis} />
            </div>
            <div className="text-sm text-brand-textSecondary">
              Total chapters: <span className="font-bold text-white">{comic.chapters.length}</span>
            </div>
          </div>
        </div>
      </section>

      <ChapterList chapters={comic.chapters} comicSlug={comic.slug} />

      {related.length > 0 && (
        <section>
          <SectionTitle title="Related Comics" />
          <div className="flex gap-4 overflow-x-auto pb-3">
            {related.map((item) => (
              <div key={item.id} className="w-40 shrink-0">
                <ComicCard comic={item} compact />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-brand-textMuted">{label}</span>
      <span className="flex items-center gap-1 font-semibold text-white">
        {icon}
        {value}
      </span>
    </div>
  );
}
