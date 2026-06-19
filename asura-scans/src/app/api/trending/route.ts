import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cacheGet, cacheSet } from "@/lib/redis";

export async function GET() {
  try {
    const cached = await cacheGet<unknown[]>("trending");
    if (cached) return NextResponse.json({ comics: cached });

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const viewCounts = await prisma.view.groupBy({
      by: ["comicId"],
      where: {
        comicId: { not: null },
        createdAt: { gte: weekAgo },
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    const topIds = viewCounts
      .filter((v) => v.comicId !== null)
      .slice(0, 10)
      .map((v) => v.comicId!);

    let comics = await prisma.comic.findMany({
      where: { id: { in: topIds } },
      include: { chapters: { orderBy: { number: "desc" }, take: 1 } },
    });

    if (comics.length < 10) {
      comics = await prisma.comic.findMany({
        orderBy: { totalViews: "desc" },
        take: 10,
        include: { chapters: { orderBy: { number: "desc" }, take: 1 } },
      });
    }

    const result = comics.map((c, i) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      coverImage: c.coverImage,
      avgRating: c.avgRating,
      latestChapter: c.chapters[0]?.number,
      rank: i + 1,
    }));

    await cacheSet("trending", result, 300);
    return NextResponse.json({ comics: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch trending" }, { status: 500 });
  }
}
