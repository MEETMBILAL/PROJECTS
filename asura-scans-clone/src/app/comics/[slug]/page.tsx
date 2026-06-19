import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, Eye, Calendar, User, Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { StatusBadge, TypeBadge } from "@/components/comics/status-badge";
import { GenreBadge } from "@/components/comics/genre-badge";
import { Synopsis } from "@/components/comics/synopsis";
import { ChapterList } from "@/components/comics/chapter-list";
import { RatingWidget } from "@/components/comics/rating-widget";
import { BookmarkButton } from "@/components/comics/bookmark-button";
import { ShareButtons } from "@/components/comics/share-buttons";
import { RelatedComics } from "@/components/comics/related-comics";
import { BookmarkHydrator } from "@/components/comics/bookmark-hydrator";
import { ViewTracker } from "@/components/comics/view-tracker";
import { getComicBySlug, getChapters, getRelated } from "@/lib/queries";
import { getUserBookmarkIds } from "@/lib/bookmarks";
import { formatCompact, formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const comic = await getComicBySlug(params.slug);
  if (!comic) return { title: "Not found" };
  return {
    title: comic.title,
    description: comic.synopsis.slice(0, 160),
    openGraph: {
      title: comic.title,
      description: comic.synopsis.slice(0, 160),
      images: [comic.coverImage],
    },
  };
}

export default async function ComicDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const comic = await getComicBySlug(params.slug);
  if (!comic) notFound();

  const [chapters, related, bookmarkIds] = await Promise.all([
    getChapters(comic.id),
    getRelated(comic.id, comic.genres ?? [], 12),
    getUserBookmarkIds(),
  ]);

  const firstChapter = chapters[chapters.length - 1];
  const latestChapter = chapters[0];
  const isBookmarked = bookmarkIds.includes(comic.id);

  return (
    <div>
      <BookmarkHydrator ids={bookmarkIds} />
      <ViewTracker comicId={comic.id} />

      {/* Banner backdrop */}
      <div className="relative h-48 w-full overflow-hidden sm:h-64">
        <Image
          src={comic.bannerImage ?? comic.coverImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-bg/40 to-brand-bg" />
      </div>

      <div className="container -mt-28 pb-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
          {/* Cover */}
          <div className="mx-auto w-44 md:mx-0 md:w-full">
            <div className="relative aspect-cover w-full overflow-hidden rounded-lg shadow-purple-soft ring-1 ring-brand-surface">
              <Image
                src={comic.coverImage}
                alt={comic.title}
                fill
                priority
                sizes="220px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="pt-2 md:pt-28">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={comic.status} />
              <TypeBadge type={comic.type} />
              {comic.isNew && (
                <span className="rounded-md bg-brand-new px-2 py-0.5 text-xs font-semibold text-white">
                  NEW
                </span>
              )}
            </div>

            <h1 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
              {comic.title}
            </h1>
            {comic.altTitles.length > 0 && (
              <p className="mt-1 text-sm text-brand-text-muted">
                {comic.altTitles.join(" · ")}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-brand-text-secondary">
              {comic.author && (
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4" /> {comic.author}
                </span>
              )}
              {comic.artist && (
                <span className="inline-flex items-center gap-1.5">
                  <Paintbrush className="h-4 w-4" /> {comic.artist}
                </span>
              )}
              {comic.releaseYear && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> {comic.releaseYear}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-4 w-4" /> {formatNumber(comic.totalViews)} views
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" /> {comic.chapterCount} chapters
              </span>
            </div>

            <div className="mt-4">
              <RatingWidget
                comicId={comic.id}
                initialAvg={comic.avgRating}
                initialCount={comic.ratingCount}
              />
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {firstChapter && (
                <Button asChild size="lg">
                  <Link href={`/comics/${comic.slug}/chapter/${firstChapter.number}`}>
                    <BookOpen className="h-4 w-4" />
                    Start Reading
                  </Link>
                </Button>
              )}
              {latestChapter && latestChapter.id !== firstChapter?.id && (
                <Button asChild variant="secondary" size="lg">
                  <Link href={`/comics/${comic.slug}/chapter/${latestChapter.number}`}>
                    Latest Chapter
                  </Link>
                </Button>
              )}
              <BookmarkButton
                comicId={comic.id}
                initialBookmarked={isBookmarked}
                size="lg"
              />
              <ShareButtons title={comic.title} />
            </div>

            {/* Genres */}
            {comic.genres && comic.genres.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {comic.genres.map((g) => (
                  <GenreBadge key={g} name={g} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Synopsis */}
        <section className="mt-10">
          <SectionHeading title="Synopsis" />
          <Synopsis text={comic.synopsis} />
        </section>

        {/* Chapters */}
        <section className="mt-10">
          <SectionHeading title={`Chapters (${comic.chapterCount})`} />
          <ChapterList slug={comic.slug} chapters={chapters} />
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-10">
            <SectionHeading title="You may also like" />
            <RelatedComics comics={related} />
          </section>
        )}
      </div>
    </div>
  );
}
