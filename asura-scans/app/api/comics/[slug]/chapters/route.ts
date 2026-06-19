export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getChapterBySlugAndNumber } from "@/lib/comics";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const numberParam = request.nextUrl.searchParams.get("number");

    if (numberParam) {
      const num = parseFloat(numberParam);
      const result = await getChapterBySlugAndNumber(params.slug, num);
      if (!result) {
        return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
      }

      const allChapters = await prisma.chapter.findMany({
        where: { comicId: result.chapter.comicId },
        orderBy: { number: "desc" },
        select: { number: true, title: true },
      });

      const pagesRes = await fetch(
        `${request.nextUrl.origin}/api/chapters/${result.chapter.id}/pages`
      );
      const pagesData = await pagesRes.json();

      return NextResponse.json({
        chapter: {
          ...result.chapter,
          pages: pagesData.pages,
        },
        prev: result.prev,
        next: result.next,
        allChapters,
      });
    }

    const comic = await prisma.comic.findUnique({ where: { slug: params.slug } });
    if (!comic) {
      return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    }

    const chapters = await prisma.chapter.findMany({
      where: { comicId: comic.id },
      orderBy: { number: "desc" },
      select: {
        id: true,
        number: true,
        title: true,
        views: true,
        publishedAt: true,
      },
    });

    return NextResponse.json({ chapters });
  } catch (error) {
    console.error("GET /api/comics/[slug]/chapters error:", error);
    return NextResponse.json({ error: "Failed to fetch chapters" }, { status: 500 });
  }
}
