import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { Share2 } from "lucide-react";
import { getComicBySlug, getRelatedComics } from "@/lib/comics";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/comics/StatusBadge";
import { GenreBadge } from "@/components/comics/GenreBadge";
import { RatingStars } from "@/components/comics/RatingStars";
import { BookmarkButton } from "@/components/comics/BookmarkButton";
import { ChapterList } from "@/components/comics/ChapterList";
import { ComicCard } from "@/components/comics/ComicCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SynopsisExpand } from "@/components/comics/SynopsisExpand";
import { formatViews } from "@/lib/utils";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const comic = await getComicBySlug(params.slug).catch(() => null);
  if (!comic) return { title: "Comic Not Found" };
  return { title: comic.title, description: comic.synopsis.slice(0, 160) };
}

export const dynamic = "force-dynamic";

export default async function ComicDetailPage({ params }: Props) {
  const comic = await getComicBySlug(params.slug).catch(() => null);
  if (!comic) notFound();

  const session = await getServerSession(authOptions);
  let bookmark = null;
  if (session?.user?.id) {
    bookmark = await prisma.bookmark.findUnique({
      where: { userId_comicId: { userId: session.user.id, comicId: comic.id } },
    }).catch(() => null);
  }

  const genreIds = comic.genres?.map((g) => g.id) ?? [];
  const related = genreIds.length
    ? await getRelatedComics(comic.id, genreIds).catch(() => [])
    : [];

  const firstChapter = comic.chapters[comic.chapters.length - 1];
  const latestChapter = comic.chapters[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        <div className="flex justify-center md:justify-start">
          <Image
            src={comic.coverImage}
            alt={comic.title}
            width={280}
            height={373}
            className="comic-cover w-[280px] rounded-lg shadow-xl"
            priority
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{comic.title}</h1>
          {comic.altTitles.length > 0 && (
            <p className="text-brand-text-muted text-sm mb-3">
              {comic.altTitles.join(" / ")}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            <StatusBadge status={comic.status} />
            <Badge variant="secondary">{comic.type}</Badge>
            {comic.releaseYear && (
              <Badge variant="secondary">{comic.releaseYear}</Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            {comic.author && (
              <p>
                <span className="text-brand-text-muted">Author: </span>
                <span className="text-white">{comic.author}</span>
              </p>
            )}
            {comic.artist && (
              <p>
                <span className="text-brand-text-muted">Artist: </span>
                <span className="text-white">{comic.artist}</span>
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <RatingStars rating={comic.avgRating} count={comic.ratingCount} size="lg" />
            <span className="text-sm text-brand-text-secondary">
              {formatViews(comic.totalViews)} views
            </span>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <BookmarkButton
              comicId={comic.id}
              initialBookmarked={!!bookmark}
              bookmarkId={bookmark?.id}
            />
            {firstChapter && (
              <Button asChild>
                <Link href={`/comics/${comic.slug}/chapter/${firstChapter.number}`}>
                  Start Reading
                </Link>
              </Button>
            )}
            {latestChapter && latestChapter !== firstChapter && (
              <Button asChild variant="secondary">
                <Link href={`/comics/${comic.slug}/chapter/${latestChapter.number}`}>
                  Latest Ch. {latestChapter.number}
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" aria-label="Share">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {comic.genres && comic.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {comic.genres.map((g) => (
                <GenreBadge key={g.slug} name={g.name} slug={g.slug} />
              ))}
            </div>
          )}

          <SynopsisExpand synopsis={comic.synopsis} />

          <p className="text-sm text-brand-text-secondary mt-4">
            {comic.chapters.length} chapters
          </p>
        </div>
      </div>

      <section className="mt-12" aria-labelledby="chapters-heading">
        <h2 id="chapters-heading" className="section-heading">
          Chapters
        </h2>
        <ChapterList chapters={comic.chapters} slug={comic.slug} />
      </section>

      {related.length > 0 && (
        <section className="mt-12" aria-labelledby="related-heading">
          <h2 id="related-heading" className="section-heading">
            Related Comics
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {related.map((c) => (
              <ComicCard key={c.id} comic={c} className="flex-shrink-0 w-[160px]" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
