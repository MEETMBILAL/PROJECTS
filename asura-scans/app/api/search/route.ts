export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { searchComics } from "@/lib/search";

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q") ?? "";
    if (!q.trim()) {
      return NextResponse.json({ results: [] });
    }

    const meiliResults = await searchComics(q, 20);
    let results;

    if (meiliResults) {
      const comics = await prisma.comic.findMany({
        where: { id: { in: meiliResults.map((r) => r.id) } },
        include: {
          chapters: {
            orderBy: { number: "desc" },
            take: 1,
            select: { number: true, publishedAt: true },
          },
        },
      });
      results = comics.map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        coverImage: c.coverImage,
        latestChapter: c.chapters[0]
          ? { number: c.chapters[0].number, publishedAt: c.chapters[0].publishedAt }
          : undefined,
      }));
    } else {
      const comics = await prisma.comic.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { altTitles: { has: q } },
          ],
        },
        take: 20,
        include: {
          chapters: {
            orderBy: { number: "desc" },
            take: 1,
            select: { number: true, publishedAt: true },
          },
        },
      });
      results = comics.map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        coverImage: c.coverImage,
        latestChapter: c.chapters[0]
          ? { number: c.chapters[0].number, publishedAt: c.chapters[0].publishedAt }
          : undefined,
      }));
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
