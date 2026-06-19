import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookmarkGrid } from "@/components/bookmarks/bookmark-grid";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ComicCardData } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Bookmarks",
};

export default async function BookmarksPage() {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/login?callbackUrl=/bookmarks");

  const bookmarks = await prisma.bookmark
    .findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        comic: {
          select: {
            id: true,
            slug: true,
            title: true,
            coverImage: true,
            status: true,
            type: true,
            avgRating: true,
            totalViews: true,
            createdAt: true,
            updatedAt: true,
            chapters: {
              orderBy: { number: "desc" },
              take: 1,
              select: { number: true },
            },
          },
        },
      },
    })
    .catch(() => []);

  const comics: ComicCardData[] = bookmarks.map((b) => {
    const { chapters, ...comic } = b.comic;
    const latest = chapters[0]?.number ?? 0;
    const lastRead = b.lastReadChapter ?? 0;
    const unread = Math.max(0, Math.round(latest - lastRead));
    return {
      ...comic,
      latestChapter: latest,
      lastReadChapter: b.lastReadChapter,
      unreadCount: unread,
    };
  });

  return (
    <div className="container space-y-6 py-6">
      <header className="flex items-center gap-3">
        <Bookmark className="h-6 w-6 text-brand-purple" />
        <h1 className="text-2xl font-bold text-white">My Bookmarks</h1>
      </header>

      {comics.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-brand-surface py-24 text-center">
          <Bookmark className="h-10 w-10 text-brand-text-muted" />
          <p className="text-lg font-semibold text-white">No bookmarks yet</p>
          <p className="max-w-sm text-sm text-brand-text-secondary">
            Start following series to keep track of new chapters and pick up where you left off.
          </p>
          <Button asChild className="mt-2">
            <Link href="/browse">Browse comics</Link>
          </Button>
        </div>
      ) : (
        <BookmarkGrid comics={comics} />
      )}
    </div>
  );
}
