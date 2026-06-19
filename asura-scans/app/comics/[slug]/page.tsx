export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Share2, Link2 } from "lucide-react";
import { getComicBySlug, getRelatedComics } from "@/lib/comics";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { formatViews } from "@/lib/utils";
import { StatusBadge } from "@/components/comics/StatusBadge";
import { StarRating } from "@/components/comics/StarRating";
import { GenreTag } from "@/components/comics/GenreTag";
import { BookmarkButton } from "@/components/comics/BookmarkButton";
import { ChapterList } from "@/components/comics/ChapterList";
import { ComicCard } from "@/components/comics/ComicCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SynopsisExpand } from "@/components/comics/SynopsisExpand";

interface ComicDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ComicDetailPageProps) {
  const comic = await getComicBySlug(params.slug);
  if (!comic) return { title: "Comic Not Found" };
  return {
    title: comic.title,
    description: comic.synopsis.slice(0, 160),
    openGraph: { images: [comic.coverImage] },
  };
}

export default async function ComicDetailPage({ params }: ComicDetailPageProps) {
  const comic = await getComicBySlug(params.slug);
  if (!comic) notFound();

  const user = await getCurrentUser();
  let bookmark = null;
  if (user) {
    bookmark = await prisma.bookmark.findUnique({
      where: { userId_comicId: { userId: user.id, comicId: comic.id } },
    });
  }

  const genreIds = comic.genres?.map((g) => g.id) ?? [];
  const related = await getRelatedComics(comic.id, genreIds);
  const firstChapter = comic.chapters?.[comic.chapters.length - 1];
  const latestChapter = comic.chapters?.[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="relative mx-auto aspect-cover w-full max-w-[280px] overflow-hidden rounded-lg lg:mx-0">
          <Image
            src={comic.coverImage}
            alt={comic.title}
            fill
            className="object-cover"
            priority
            sizes="280px"
          />
        </div>

        <div>
          <h1 className="mb-2 text-3xl font-bold text-brand-text-primary md:text-4xl">
            {comic.title}
          </h1>

          {comic.altTitles.length > 0 && (
            <p className="mb-4 text-sm text-brand-muted">
              {comic.altTitles.join(" · ")}
            </p>
          )}

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <StatusBadge status={comic.status} />
            <Badge variant="outline" className="border-brand-purple/50 text-brand-purple-light">
              {comic.type}
            </Badge>
            {comic.releaseYear && (
              <span className="text-sm text-brand-text-secondary">{comic.releaseYear}</span>
            )}
          </div>

          <div className="mb-4 space-y-1 text-sm text-brand-text-secondary">
            {comic.author && <p><span className="text-brand-muted">Author:</span> {comic.author}</p>}
            {comic.artist && <p><span className="text-brand-muted">Artist:</span> {comic.artist}</p>}
          </div>

          <StarRating
            rating={comic.avgRating}
            count={comic.ratingCount}
            className="mb-4"
          />

          <p className="mb-6 text-sm text-brand-text-secondary">
            {formatViews(comic.totalViews)} views
          </p>

          <div className="mb-6 flex flex-wrap gap-3">
            <BookmarkButton
              comicId={comic.id}
              initialBookmarked={!!bookmark}
              bookmarkId={bookmark?.id}
            />
            <Button asChild className="bg-brand-purple hover:bg-brand-purple-light">
              <Link href={`/comics/${comic.slug}/chapter/${firstChapter?.number ?? 1}`}>
                Start Reading
              </Link>
            </Button>
            {latestChapter && (
              <Button asChild variant="outline" className="border-brand-surface">
                <Link href={`/comics/${comic.slug}/chapter/${latestChapter.number}`}>
                  Latest Ch. {latestChapter.number}
                </Link>
              </Button>
            )}
          </div>

          <div className="mb-4 flex gap-2">
            <Button variant="ghost" size="icon" aria-label="Share on social">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Copy link">
              <Link2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {comic.genres?.map((genre) => (
              <GenreTag key={genre.id} name={genre.name} slug={genre.slug} />
            ))}
          </div>

          <SynopsisExpand text={comic.synopsis} />

          <p className="mt-4 text-sm text-brand-text-secondary">
            <span className="font-medium text-brand-text-primary">
              {comic.chapters?.length ?? 0}
            </span>{" "}
            chapters total
          </p>
        </div>
      </div>

      <section className="mt-12" aria-labelledby="chapters-heading">
        <SectionHeading title="Chapters" />
        <ChapterList
          chapters={comic.chapters ?? []}
          slug={comic.slug}
        />
      </section>

      {related.length > 0 && (
        <section className="mt-12" aria-labelledby="related-heading">
          <SectionHeading title="Related Comics" />
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {related.map((c) => (
              <div key={c.id} className="w-[160px] shrink-0">
                <ComicCard comic={c} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
