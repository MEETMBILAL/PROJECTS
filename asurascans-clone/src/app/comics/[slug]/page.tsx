import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Calendar, Eye, Layers, PenTool, User } from "lucide-react";

import { BookmarkButton } from "@/components/bookmark-button";
import { ChapterList } from "@/components/chapter-list";
import { ComicCard } from "@/components/comic-card";
import { ExpandableText } from "@/components/expandable-text";
import { GenrePill } from "@/components/genre-pill";
import { RatingWidget } from "@/components/rating-widget";
import { ScrollRow, SectionHeading } from "@/components/section-row";
import { StatusBadge, TypeBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { getComicBySlug, getRelated } from "@/lib/data";
import { formatCompact } from "@/lib/utils";

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
    description: comic.synopsis.slice(0, 155),
    openGraph: { images: [comic.coverImage] },
  };
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4 text-brand-text-muted" />
      <span className="text-brand-text-muted">{label}:</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}

export default async function ComicDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const comic = await getComicBySlug(params.slug);
  if (!comic) notFound();

  const related = await getRelated(params.slug, 8);
  const firstChapter = comic.chapters[comic.chapters.length - 1]?.number ?? 1;

  return (
    <div className="relative">
      {/* Blurred banner backdrop */}
      <div className="absolute inset-x-0 top-0 h-72 overflow-hidden">
        <Image
          src={comic.bannerImage ?? comic.coverImage}
          alt=""
          fill
          className="object-cover opacity-20 blur-sm"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-bg" />
      </div>

      <div className="container relative max-w-screen-2xl space-y-10 py-6">
        {/* Top section */}
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <div className="mx-auto w-44 md:mx-0 md:w-full">
            <div className="relative aspect-cover w-full overflow-hidden rounded-lg ring-1 ring-brand-border">
              <Image
                src={comic.coverImage}
                alt={comic.title}
                fill
                priority
                sizes="260px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={comic.status} />
              <TypeBadge type={comic.type} />
              {comic.releaseYear && (
                <span className="text-sm text-brand-text-muted">
                  {comic.releaseYear}
                </span>
              )}
            </div>

            <h1 className="text-balance text-2xl font-extrabold leading-tight text-white sm:text-4xl">
              {comic.title}
            </h1>
            {comic.altTitles.length > 0 && (
              <p className="text-sm text-brand-text-muted">
                {comic.altTitles.join(" · ")}
              </p>
            )}

            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {comic.author && <Stat icon={User} label="Author" value={comic.author} />}
              {comic.artist && <Stat icon={PenTool} label="Artist" value={comic.artist} />}
              <Stat icon={Layers} label="Chapters" value={comic.chapters.length} />
              <Stat
                icon={Eye}
                label="Views"
                value={formatCompact(comic.totalViews)}
              />
            </div>

            <RatingWidget
              slug={comic.slug}
              avgRating={comic.avgRating}
              ratingCount={comic.ratingCount}
            />

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 pt-1">
              <Button asChild size="lg">
                <Link href={`/comics/${comic.slug}/chapter/${firstChapter}`}>
                  <BookOpen className="h-4 w-4" /> Start Reading
                </Link>
              </Button>
              <BookmarkButton slug={comic.slug} title={comic.title} size="lg" />
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 pt-2">
              {comic.genres.map((g) => (
                <GenrePill key={g.id} name={g.name} slug={g.slug} />
              ))}
            </div>

            {/* Synopsis */}
            <div className="pt-2">
              <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-brand-text-muted">
                Synopsis
              </h2>
              <ExpandableText text={comic.synopsis} />
            </div>
          </div>
        </div>

        {/* Chapter list */}
        <ChapterList slug={comic.slug} chapters={comic.chapters} />

        {/* Related */}
        {related.length > 0 && (
          <section>
            <SectionHeading title="You May Also Like" />
            <ScrollRow>
              {related.map((c) => (
                <div key={c.id} className="w-36 shrink-0 snap-start">
                  <ComicCard comic={c} />
                </div>
              ))}
            </ScrollRow>
          </section>
        )}
      </div>
    </div>
  );
}
