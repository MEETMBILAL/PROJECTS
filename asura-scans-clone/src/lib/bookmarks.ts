import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { comicCardSelect, toComicCard } from "@/lib/serializers";
import type { BookmarkData } from "@/types";

/** Returns the set of comic ids the current user has bookmarked. */
export async function getUserBookmarkIds(): Promise<string[]> {
  const session = await auth();
  if (!session?.user) return [];
  const rows = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    select: { comicId: true },
  });
  return rows.map((r) => r.comicId);
}

export async function getUserBookmarks(): Promise<BookmarkData[]> {
  const session = await auth();
  if (!session?.user) return [];

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      comic: {
        select: {
          ...comicCardSelect,
          chapters: {
            orderBy: { number: "desc" },
            take: 1,
            select: {
              id: true,
              number: true,
              title: true,
              views: true,
              publishedAt: true,
            },
          },
        },
      },
    },
  });

  return bookmarks.map((b) => {
    const card = toComicCard(b.comic);
    const latestChapterNumber = b.comic.chapters[0]?.number ?? null;
    const lastRead = b.lastReadChapter ?? null;
    const unreadCount =
      latestChapterNumber !== null && lastRead !== null
        ? Math.max(0, Math.round(latestChapterNumber - lastRead))
        : 0;
    return {
      ...card,
      bookmarkId: b.id,
      lastReadChapter: lastRead,
      latestChapterNumber,
      unreadCount,
    };
  });
}
