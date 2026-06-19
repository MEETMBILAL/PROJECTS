import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Eye, Calendar, User, Brush, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/comic/status-badge";
import { GenreBadge } from "@/components/comic/genre-badge";
import { ExpandableText } from "@/components/comic/expandable-text";
import { ChapterList } from "@/components/comic/chapter-list";
import { BookmarkButton } from "@/components/comic/bookmark-button";
import { RateWidget } from "@/components/comic/rate-widget";
import { ViewTracker } from "@/components/comic/view-tracker";
import { ComicRow } from "@/components/comic/comic-row";
import { SectionHeading } from "@/components/section-heading";
import { getComicBySlug, getChaptersForComic, getRelated } from "@/lib/comics";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCompact, formatChapterNumber, TYPE_LABELS } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const comic = await getComicBySlug(params.slug).catch(() => null);
  if (!comic) return { title: "Not found" };
  return {
    title: comic.title,
    description: comic.synopsis.slice(0, 160),
    openGraph: { images: [comic.coverImage] },
  };
}

export default async function ComicDetailPage({ params }: { params: { slug: string } }) {
  const comic = await getComicBySlug(params.slug).catch(() => null);
  if (!comic) notFound();

  const chapters = await getChaptersForComic(comic.id).catch(() => []);
  const genreSlugs = comic.genres.map((g) => g.genre.slug);
  const related = await getRelated(comic.id, genreSlugs, 12).catch(() => []);

  const user = await getCurrentUser();
  let isBookmarked = false;
  let userRating: number | null = null;
  if (user?.id) {
    const [bm, rating] = await Promise.all([
      prisma.bookmark.findUnique({
        where: { userId_comicId: { userId: user.id, comicId: comic.id } },
        select: { id: true },
      }),
      prisma.rating.findUnique({
        where: { userId_comicId: { userId: user.id, comicId: comic.id } },
        select: { value: true },
      }),
    ]).catch(() => [null, null] as const);
    isBookmarked = !!bm;
    userRating = rating?.value ?? null;
  }

  const firstChapter = chapters.length ? chapters[chapters.length - 1].number : 1;
  const latestChapter = chapters.length ? chapters[0].number : 1;

  return (
    <div className="container space-y-10 py-6">
      <ViewTracker comicId={comic.id} />

      {/* Banner backdrop */}
      <div className="relative overflow-hidden rounded-lg border border-brand-surface">
        <div className="absolute inset-0">
          <Image
            src={comic.bannerImage ?? comic.coverImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-30 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/90 to-brand-bg/60" />
        </div>

        <div className="relative grid gap-6 p-5 sm:p-8 md:grid-cols-[220px_1fr]">
          {/* Cover */}
          <div className="mx-auto w-44 md:mx-0 md:w-full">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-purple-soft ring-1 ring-brand-surface">
              <Image
                src={comic.coverImage}
                alt={comic.title}
                fill
                sizes="220px"
                priority
                className="object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={comic.status} />
              <Badge variant="outline">{TYPE_LABELS[comic.type]}</Badge>
              {comic.releaseYear && <Badge variant="muted">{comic.releaseYear}</Badge>}
            </div>

            <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
              {comic.title}
            </h1>
            {comic.altTitles.length > 0 && (
              <p className="text-sm text-brand-text-muted">{comic.altTitles.join(" · ")}</p>
            )}

            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-brand-text-secondary">
              {comic.author && (
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4" /> {comic.author}
                </span>
              )}
              {comic.artist && (
                <span className="inline-flex items-center gap-1.5">
                  <Brush className="h-4 w-4" /> {comic.artist}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-4 w-4" /> {formatCompact(comic.totalViews)} views
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {comic._count.chapters} chapters
              </span>
            </div>

            <RateWidget
              comicId={comic.id}
              avgRating={comic.avgRating}
              ratingCount={comic.ratingCount}
              userRating={userRating}
            />

            {/* Actions */}
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href={`/comics/${comic.slug}/chapter/${firstChapter}`}>
                  <BookOpen className="h-4 w-4" /> Start Reading
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href={`/comics/${comic.slug}/chapter/${latestChapter}`}>
                  Latest Ch. {formatChapterNumber(latestChapter)}
                </Link>
              </Button>
              <BookmarkButton comicId={comic.id} initialBookmarked={isBookmarked} size="lg" />
              <Button variant="ghost" size="icon" aria-label="Share">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Genres + synopsis */}
      <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div>
            <SectionHeading title="Synopsis" />
            <ExpandableText text={comic.synopsis} />
          </div>

          <div>
            <SectionHeading title={`Chapters (${comic._count.chapters})`} />
            <ChapterList slug={comic.slug} chapters={chapters} />
          </div>
        </div>

        <aside className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-text-muted">
              Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {comic.genres.map((g) => (
                <GenreBadge key={g.genre.id} name={g.genre.name} slug={g.genre.slug} />
              ))}
            </div>
          </div>
        </aside>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section>
          <SectionHeading title="You May Also Like" />
          <ComicRow comics={related} desktopCols={6} />
        </section>
      )}
    </div>
  );
}
