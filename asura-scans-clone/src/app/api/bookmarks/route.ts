import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { comicCardSelect, toComicCard } from "@/lib/serializers";
import type { BookmarkData } from "@/types";

const createSchema = z.object({
  comicId: z.string().min(1),
  lastReadChapter: z.number().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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

    const items: BookmarkData[] = bookmarks.map((b) => {
      const card = toComicCard(b.comic);
      const latestChapterNumber = b.comic.chapters[0]?.number ?? null;
      const lastRead = b.lastReadChapter ?? null;
      const unreadCount =
        latestChapterNumber !== null && lastRead !== null
          ? Math.max(0, Math.round(latestChapterNumber - lastRead))
          : latestChapterNumber !== null && lastRead === null
            ? 0
            : 0;
      return {
        ...card,
        bookmarkId: b.id,
        lastReadChapter: lastRead,
        latestChapterNumber,
        unreadCount,
      };
    });

    return NextResponse.json({ items, total: items.length });
  } catch (err) {
    console.error("[GET /api/bookmarks]", err);
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const bookmark = await prisma.bookmark.upsert({
      where: {
        userId_comicId: {
          userId: session.user.id,
          comicId: parsed.data.comicId,
        },
      },
      update:
        parsed.data.lastReadChapter !== undefined
          ? { lastReadChapter: parsed.data.lastReadChapter }
          : {},
      create: {
        userId: session.user.id,
        comicId: parsed.data.comicId,
        lastReadChapter: parsed.data.lastReadChapter,
      },
    });

    return NextResponse.json({ bookmark }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/bookmarks]", err);
    return NextResponse.json({ error: "Failed to add bookmark" }, { status: 500 });
  }
}
