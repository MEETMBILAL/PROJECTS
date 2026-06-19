import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { comicId } = await request.json();
    if (!comicId) {
      return NextResponse.json({ error: "comicId required" }, { status: 400 });
    }

    const bookmark = await prisma.bookmark.upsert({
      where: {
        userId_comicId: { userId: session.user.id, comicId },
      },
      create: { userId: session.user.id, comicId },
      update: {},
    });

    return NextResponse.json(bookmark);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add bookmark" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ bookmarks: [] });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
      include: {
        comic: {
          include: {
            chapters: { orderBy: { number: "desc" }, take: 1 },
          },
        },
      },
    });

    return NextResponse.json({
      bookmarks: bookmarks.map((b) => {
        const latest = b.comic.chapters[0]?.number ?? 0;
        const unread = b.lastReadChapter
          ? Math.max(0, latest - b.lastReadChapter)
          : latest;
        return {
          id: b.id,
          lastReadChapter: b.lastReadChapter,
          comic: {
            id: b.comic.id,
            slug: b.comic.slug,
            title: b.comic.title,
            coverImage: b.comic.coverImage,
            avgRating: b.comic.avgRating,
            latestChapter: latest,
            unreadCount: unread,
          },
        };
      }),
      slugs: bookmarks.map((b) => b.comic.slug),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }
}
