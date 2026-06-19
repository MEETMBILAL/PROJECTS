export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  getComicBySlug,
  getChaptersByComicSlug,
  getRelatedComics,
} from "@/lib/comics";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { StarRating } from "@/components/comics/StarRating";
import { StatusBadge } from "@/components/comics/StatusBadge";
import { BookmarkButton } from "@/components/comics/BookmarkButton";
import { ChapterList } from "@/components/comics/ChapterList";
import { ComicCard } from "@/components/comics/ComicCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatViews } from "@/lib/utils";
import { Share2 } from "lucide-react";
import { SynopsisExpand } from "@/components/comics/SynopsisExpand";

interface ComicPageProps {
  params: { slug: string };
}

async function ComicDetailContent({ slug }: { slug: string }) {
  const [comic, chapters, user] = await Promise.all([
    getComicBySlug(slug),
    getChaptersByComicSlug(slug),
    getCurrentUser(),
  ]);

  if (!comic) notFound();

  const [related, bookmark] = await Promise.all([
    getRelatedComics(comic.id),
    user
      ? prisma.bookmark.findUnique({
          where: { userId_comicId: { userId: user.id, comicId: comic.id } },
        })
      : null,
  ]);

  const firstChapter = chapters[chapters.length - 1];
  const latestChapter = chapters[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        <div className="relative aspect-cover w-full max-w-[280px] mx-auto md:mx-0 overflow-hidden rounded-lg">
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
          <h1 className="text-3xl font-bold text-white mb-2">{comic.title}</h1>
          {comic.altTitles.length > 0 && (
            <p className="text-sm text-brand-muted mb-3">
              {comic.altTitles.join(" · ")}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mb-4">
            {comic.author && (
              <span className="text-sm text-brand-secondary">
                Author: <span className="text-white">{comic.author}</span>
              </span>
            )}
            {comic.artist && (
              <span className="text-sm text-brand-secondary">
                Artist: <span className="text-white">{comic.artist}</span>
              </span>
            )}
            <StatusBadge status={comic.status} />
            <Badge variant="outline">{comic.type}</Badge>
            {comic.releaseYear && (
              <span className="text-sm text-brand-muted">{comic.releaseYear}</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <StarRating rating={comic.avgRating} size="md" />
            <span className="text-sm text-brand-secondary">
              {comic.avgRating.toFixed(1)} / 10 ({comic.ratingCount} votes)
            </span>
            <span className="text-sm text-brand-muted">
              {formatViews(comic.totalViews)} views
            </span>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <BookmarkButton
              comicId={comic.id}
              initialBookmarked={!!bookmark}
              bookmarkId={bookmark?.id}
            />
            <Button asChild>
              <Link
                href={
                  firstChapter
                    ? `/comics/${comic.slug}/chapter/${firstChapter.number}`
                    : `#`
                }
              >
                Start Reading
              </Link>
            </Button>
            {latestChapter && (
              <Button variant="secondary" asChild>
                <Link href={`/comics/${comic.slug}/chapter/${latestChapter.number}`}>
                  Latest Ch. {latestChapter.number}
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" aria-label="Share">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {comic.genres.map((genre) => (
              <Link key={genre.id} href={`/browse?genres=${genre.slug}`}>
                <Badge variant="outline" className="hover:bg-brand-purple/10 cursor-pointer">
                  {genre.name}
                </Badge>
              </Link>
            ))}
          </div>

          <SynopsisExpand text={comic.synopsis} />

          <p className="text-sm text-brand-secondary mt-4">
            {comic.chapterCount} chapters
          </p>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="section-heading">Chapters</h2>
        <ChapterList chapters={chapters} comicSlug={comic.slug} />
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="section-heading">Related Comics</h2>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {related.map((c) => (
              <div key={c.id} className="w-36 shrink-0">
                <ComicCard comic={c} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export async function generateMetadata({ params }: ComicPageProps) {
  const comic = await getComicBySlug(params.slug);
  return {
    title: comic?.title ?? "Comic",
    description: comic?.synopsis?.slice(0, 160),
  };
}

export default function ComicPage({ params }: ComicPageProps) {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
            <Skeleton className="aspect-cover max-w-[280px]" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      }
    >
      <ComicDetailContent slug={params.slug} />
    </Suspense>
  );
}
