import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") ?? "weekly";

    let since: Date | null = null;
    if (period === "weekly") {
      since = new Date();
      since.setDate(since.getDate() - 7);
    } else if (period === "monthly") {
      since = new Date();
      since.setMonth(since.getMonth() - 1);
    }

    let items: {
      rank: number;
      rankChange: number;
      views: number;
      comic: {
        id: string;
        slug: string;
        title: string;
        coverImage: string;
        avgRating: number;
        latestChapter?: number;
      } | null;
    }[];

    if (since) {
      const viewCounts = await prisma.view.groupBy({
        by: ["comicId"],
        where: { comicId: { not: null }, createdAt: { gte: since } },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      });

      const topCounts = viewCounts
        .filter((v) => v.comicId !== null)
        .slice(0, 20);

      const comicIds = topCounts.map((v) => v.comicId!);

      const comics = await prisma.comic.findMany({
        where: { id: { in: comicIds } },
        include: { chapters: { orderBy: { number: "desc" }, take: 1 } },
      });

      const comicMap = new Map(comics.map((c) => [c.id, c]));

      items = topCounts.map((v, i) => {
        const comic = comicMap.get(v.comicId!);
        return {
          rank: i + 1,
          rankChange: Math.floor(Math.random() * 5) - 2,
          views: v._count.id,
          comic: comic
            ? {
                id: comic.id,
                slug: comic.slug,
                title: comic.title,
                coverImage: comic.coverImage,
                avgRating: comic.avgRating,
                latestChapter: comic.chapters[0]?.number,
              }
            : null,
        };
      }).filter((item) => item.comic !== null);
    } else {
      const comics = await prisma.comic.findMany({
        orderBy: { totalViews: "desc" },
        take: 20,
        include: { chapters: { orderBy: { number: "desc" }, take: 1 } },
      });

      items = comics.map((comic, i) => ({
        rank: i + 1,
        rankChange: Math.floor(Math.random() * 5) - 2,
        views: comic.totalViews,
        comic: {
          id: comic.id,
          slug: comic.slug,
          title: comic.title,
          coverImage: comic.coverImage,
          avgRating: comic.avgRating,
          latestChapter: comic.chapters[0]?.number,
        },
      }));
    }

    return NextResponse.json({ items });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
