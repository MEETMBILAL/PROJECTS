export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { BookmarkGrid } from "@/components/bookmarks/BookmarkGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Bookmarks" };

export default async function BookmarksPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?callbackUrl=/bookmarks");

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    include: {
      comic: {
        include: {
          chapters: {
            orderBy: { number: "desc" },
            take: 1,
            select: { number: true },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const items = bookmarks.map((b) => ({
    id: b.id,
    comicId: b.comicId,
    lastReadChapter: b.lastReadChapter,
    comic: {
      id: b.comic.id,
      slug: b.comic.slug,
      title: b.comic.title,
      coverImage: b.comic.coverImage,
      status: b.comic.status,
      type: b.comic.type,
      avgRating: b.comic.avgRating,
      ratingCount: b.comic.ratingCount,
      totalViews: b.comic.totalViews,
      latestChapterNumber: b.comic.chapters[0]?.number ?? 0,
    },
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <SectionHeading title="My Bookmarks" />

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="mb-2 text-lg text-brand-text-secondary">No bookmarks yet</p>
          <p className="mb-6 text-sm text-brand-muted">
            Start exploring and save your favorite series!
          </p>
          <Button asChild className="bg-brand-purple hover:bg-brand-purple-light">
            <Link href="/browse">Browse Comics</Link>
          </Button>
        </div>
      ) : (
        <BookmarkGrid items={items} />
      )}
    </div>
  );
}
