import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { Share2, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { Badge, GenreBadge } from "@/components/badge";
import { StarRating } from "@/components/star-rating";
import { BookmarkButton, BookmarkInitializer } from "@/components/bookmark-button";
import { ChapterList } from "@/components/chapter-list";
import { ComicCard } from "@/components/comic-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { SynopsisExpandable } from "@/components/synopsis-expandable";
import { RatingSubmit } from "@/components/rating-submit";
import { formatViews } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export default async function ComicDetailPage({ params }: Props) {
  const comic = await prisma.comic.findUnique({
    where: { slug: params.slug },
    include: {
      genres: { include: { genre: true } },
      chapters: { orderBy: { number: "asc" } },
      _count: { select: { chapters: true } },
    },
  });

  if (!comic) notFound();

  const session = await getServerSession(authOptions);
  let bookmarkSlugs: string[] = [];
  if (session?.user?.id) {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
      include: { comic: { select: { slug: true } } },
    });
    bookmarkSlugs = bookmarks.map((b) => b.comic.slug);
  }

  const related = await prisma.comic.findMany({
    where: {
      id: { not: comic.id },
      genres: {
        some: { genreId: { in: comic.genres.map((g) => g.genreId) } },
      },
    },
    take: 10,
    include: { chapters: { orderBy: { number: "desc" }, take: 1 } },
  });

  const firstChapter = comic.chapters[0]?.number;
  const latestChapter = comic.chapters[comic.chapters.length - 1]?.number;

  return (
    <div className="container mx-auto px-4 py-8">
      {bookmarkSlugs.length > 0 && <BookmarkInitializer slugs={bookmarkSlugs} />}

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        <div className="relative aspect-cover rounded-cover overflow-hidden mx-auto w-full max-w-[280px]">
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
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {comic.title}
          </h1>
          {comic.altTitles.length > 0 && (
            <p className="text-brand-text-secondary text-sm mb-3">
              {comic.altTitles.join(" · ")}
            </p>
          )}

          <div className="flex flex-wrap gap-3 mb-4 text-sm text-brand-text-secondary">
            {comic.author && <span>Author: {comic.author}</span>}
            {comic.artist && <span>Artist: {comic.artist}</span>}
            {comic.releaseYear && <span>{comic.releaseYear}</span>}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="status" status={comic.status}>
              {comic.status}
            </Badge>
            <Badge>{comic.type}</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <StarRating rating={comic.avgRating} size="md" />
            <span className="text-sm text-brand-text-secondary">
              {comic.avgRating.toFixed(1)} / 10 ({comic.ratingCount} votes)
            </span>
            <span className="flex items-center gap-1 text-sm text-brand-text-secondary">
              <Eye className="h-4 w-4" />
              {formatViews(comic.totalViews)} views
            </span>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <BookmarkButton comicId={comic.id} comicSlug={comic.slug} />
            <Link href={`/comics/${comic.slug}/chapter/${latestChapter ?? firstChapter ?? 1}`}>
              <Button>Start Reading</Button>
            </Link>
            <Button variant="ghost" size="icon" aria-label="Share">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <RatingSubmit comicId={comic.id} />

          <div className="flex flex-wrap gap-2 mb-4">
            {comic.genres.map((g) => (
              <Link key={g.genreId} href={`/browse?genres=${g.genre.slug}`}>
                <GenreBadge>{g.genre.name}</GenreBadge>
              </Link>
            ))}
          </div>

          <SynopsisExpandable text={comic.synopsis} />
          <p className="text-sm text-brand-text-secondary mt-4">
            {comic._count.chapters} Chapters
          </p>
        </div>
      </div>

      <section className="mt-12">
        <SectionHeading>Chapters</SectionHeading>
        <ChapterList
          chapters={comic.chapters.map((ch) => ({
            id: ch.id,
            number: ch.number,
            title: ch.title,
            views: ch.views,
            publishedAt: ch.publishedAt.toISOString(),
          }))}
          comicSlug={comic.slug}
        />
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <SectionHeading>Related Comics</SectionHeading>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {related.map((c) => (
              <div key={c.id} className="flex-shrink-0 w-[140px]">
                <ComicCard
                  comic={{
                    id: c.id,
                    slug: c.slug,
                    title: c.title,
                    coverImage: c.coverImage,
                    avgRating: c.avgRating,
                    latestChapter: c.chapters[0]?.number,
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
