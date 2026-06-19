import Image from "next/image";
import Link from "next/link";
import { Eye, Facebook, Share2, Twitter } from "lucide-react";
import { notFound } from "next/navigation";
import { BookmarkButton } from "@/components/bookmark-button";
import { ChapterList } from "@/components/chapter-list";
import { ComicCard } from "@/components/comic-card";
import { ExpandableSynopsis } from "@/components/expandable-synopsis";
import { GenreBadge } from "@/components/genre-badge";
import { RatingStars } from "@/components/rating-stars";
import { Section } from "@/components/section";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { compactNumber } from "@/lib/utils";
import { getComicDetail, getRelatedComics } from "@/lib/comics";

type ComicDetailPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: ComicDetailPageProps) {
  const comic = await getComicDetail(params.slug);
  return {
    title: comic?.title ?? "Comic",
    description: comic?.synopsis
  };
}

export default async function ComicDetailPage({ params }: ComicDetailPageProps) {
  const comic = await getComicDetail(params.slug);

  if (!comic) {
    notFound();
  }

  const related = await getRelatedComics(comic.slug);
  const firstChapter = [...comic.chapters].sort((a, b) => a.number - b.number)[0];

  return (
    <div>
      <section className="relative overflow-hidden border-b border-brand-surface">
        <Image src={comic.bannerImage ?? comic.coverImage} alt="" fill className="object-cover opacity-25" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-background/60 via-brand-background/95 to-brand-background" />
        <div className="container-shell relative z-10 grid gap-8 py-10 md:grid-cols-[280px_1fr] md:py-14">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-brand-surface shadow-2xl">
            <Image src={comic.coverImage} alt={`${comic.title} cover`} fill className="object-cover" sizes="280px" priority />
          </div>

          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap gap-2">
              <StatusBadge status={comic.status} />
              <Badge variant="secondary">{comic.type}</Badge>
              <Badge variant="rating">{comic.releaseYear}</Badge>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">{comic.title}</h1>
            <p className="mt-2 text-sm text-brand-textMuted">{comic.altTitles.join(" / ")}</p>

            <div className="mt-5 grid gap-3 text-sm text-brand-textSecondary sm:grid-cols-2 lg:grid-cols-3">
              <p>
                <span className="text-brand-textMuted">Author:</span> {comic.author}
              </p>
              <p>
                <span className="text-brand-textMuted">Artist:</span> {comic.artist}
              </p>
              <p className="flex items-center gap-1">
                <Eye className="h-4 w-4 text-brand-primary" aria-hidden />
                {compactNumber(comic.totalViews)} views
              </p>
            </div>

            <div className="mt-5">
              <RatingStars value={comic.avgRating} voteCount={comic.ratingCount} interactive comicId={comic.id} />
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <BookmarkButton comicId={comic.id} />
              <Button asChild>
                <Link href={`/comics/${comic.slug}/chapter/${firstChapter?.number ?? 1}`}>Start Reading</Link>
              </Button>
              <Button variant="secondary" size="icon" aria-label="Share comic">
                <Share2 className="h-4 w-4" aria-hidden />
              </Button>
              <Button variant="secondary" size="icon" aria-label="Share on Twitter">
                <Twitter className="h-4 w-4" aria-hidden />
              </Button>
              <Button variant="secondary" size="icon" aria-label="Share on Facebook">
                <Facebook className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container-shell grid gap-8 py-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <Card className="p-5 md:p-6">
            <h2 className="section-heading mb-4">Synopsis</h2>
            <ExpandableSynopsis text={comic.synopsis} />
          </Card>
          <ChapterList slug={comic.slug} chapters={comic.chapters} />
        </div>

        <aside className="space-y-6">
          <Card className="p-5">
            <h2 className="mb-4 text-lg font-bold text-white">Information</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-brand-textMuted">Total Chapters</dt>
                <dd className="font-semibold text-white">{comic.chapters.length}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-brand-textMuted">Status</dt>
                <dd className="font-semibold text-white">{comic.status}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-brand-textMuted">Type</dt>
                <dd className="font-semibold text-white">{comic.type}</dd>
              </div>
            </dl>
          </Card>
          <Card className="p-5">
            <h2 className="mb-4 text-lg font-bold text-white">Genres</h2>
            <div className="flex flex-wrap gap-2">
              {comic.genres.map((genre) => (
                <GenreBadge key={genre.id} name={genre.name} slug={genre.slug} />
              ))}
            </div>
          </Card>
        </aside>
      </div>

      <Section title="Related Comics">
        <div className="flex gap-4 overflow-x-auto pb-3">
          {related.map((item) => (
            <div key={item.id} className="w-[160px] flex-none sm:w-[190px]">
              <ComicCard comic={item} />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
