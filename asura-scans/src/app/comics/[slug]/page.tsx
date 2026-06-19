import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Eye, Calendar, User, Paintbrush, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/comic/status-badge";
import { Synopsis } from "@/components/comic/synopsis";
import { RatingWidget } from "@/components/comic/rating-widget";
import { BookmarkButton } from "@/components/comic/bookmark-button";
import { ContinueButton, ShareButtons } from "@/components/comic/comic-actions";
import { ChapterList } from "@/components/comic/chapter-list";
import { ComicRail } from "@/components/comic/comic-rail";
import { SectionHeading } from "@/components/comic/section-heading";
import { getComicBySlug, getChapters, getRelated } from "@/lib/data";
import { formatCompact } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { TYPE_OPTIONS } from "@/lib/constants";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const comic = await getComicBySlug(params.slug);
  if (!comic) return { title: "Not found" };
  return {
    title: comic.title,
    description: comic.synopsis.slice(0, 160),
    openGraph: {
      title: `${comic.title} — ${SITE.name}`,
      description: comic.synopsis.slice(0, 160),
      images: [comic.coverImage],
    },
  };
}

export default async function ComicDetailPage({ params }: PageProps) {
  const comic = await getComicBySlug(params.slug);
  if (!comic) notFound();

  const [chapters, related] = await Promise.all([
    getChapters(params.slug),
    getRelated(params.slug, 12),
  ]);

  const firstChapter = chapters.length ? chapters[chapters.length - 1].number : 1;
  const typeLabel = TYPE_OPTIONS.find((t) => t.value === comic.type)?.label ?? comic.type;

  return (
    <div>
      {/* Banner backdrop */}
      <div className="relative h-48 w-full overflow-hidden sm:h-64">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={comic.bannerImage ?? comic.coverImage}
          alt=""
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/80 to-transparent" />
      </div>

      <div className="container -mt-28 sm:-mt-36">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
          {/* Cover */}
          <div>
            <div className="relative aspect-cover overflow-hidden rounded-lg border border-brand-surface shadow-purple-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={comic.coverImage}
                alt={comic.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 pt-2 md:pt-28">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={comic.status} />
                <Badge variant="secondary">{typeLabel}</Badge>
                {comic.isHot && <Badge variant="hot">HOT</Badge>}
                {comic.isNew && <Badge variant="new">NEW</Badge>}
              </div>
              <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">
                {comic.title}
              </h1>
              {comic.altTitles.length > 0 && (
                <p className="mt-1 text-sm text-brand-text-muted">{comic.altTitles.join(" · ")}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-brand-text-secondary">
              {comic.author && (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-brand-text-muted" /> {comic.author}
                </span>
              )}
              {comic.artist && (
                <span className="flex items-center gap-1.5">
                  <Paintbrush className="h-4 w-4 text-brand-text-muted" /> {comic.artist}
                </span>
              )}
              {comic.releaseYear && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-brand-text-muted" /> {comic.releaseYear}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-brand-text-muted" /> {formatCompact(comic.totalViews)}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-brand-text-muted" /> {comic.chapterCount} Chapters
              </span>
            </div>

            <RatingWidget
              comicId={comic.id}
              avgRating={comic.avgRating}
              ratingCount={comic.ratingCount}
            />

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <ContinueButton slug={comic.slug} firstChapter={firstChapter} />
              <BookmarkButton comic={comic} />
              <ShareButtons title={comic.title} />
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {comic.genres.map((g) => (
                <Link key={g.id} href={`/browse?genres=${g.slug}`}>
                  <Badge
                    variant="outline"
                    className="cursor-pointer transition-colors hover:bg-brand-purple/15"
                  >
                    {g.name}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Synopsis */}
            <div className="space-y-2">
              <h2 className="section-heading text-base">Synopsis</h2>
              <Synopsis text={comic.synopsis} />
            </div>
          </div>
        </div>

        {/* Chapters */}
        <section className="mt-10 space-y-4">
          <SectionHeading title={`Chapters (${comic.chapterCount})`} />
          <ChapterList slug={comic.slug} chapters={chapters} />
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-12 space-y-4 pb-4">
            <SectionHeading title="You May Also Like" />
            <ComicRail comics={related} />
          </section>
        )}
      </div>
    </div>
  );
}
