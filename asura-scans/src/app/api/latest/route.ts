import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cacheGet, cacheSet } from "@/lib/redis";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") ?? "24");

    const cacheKey = `latest:${limit}`;
    const cached = await cacheGet<unknown[]>(cacheKey);
    if (cached) return NextResponse.json({ comics: cached });

    const comics = await prisma.comic.findMany({
      orderBy: { updatedAt: "desc" },
      take: limit,
      include: {
        chapters: {
          orderBy: { publishedAt: "desc" },
          take: 3,
        },
      },
    });

    const result = comics.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      coverImage: c.coverImage,
      avgRating: c.avgRating,
      latestChapters: c.chapters.map((ch) => ({
        id: ch.id,
        number: ch.number,
        title: ch.title,
        publishedAt: ch.publishedAt.toISOString(),
      })),
    }));

    await cacheSet(cacheKey, result, 120);
    return NextResponse.json({ comics: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch latest" }, { status: 500 });
  }
}
