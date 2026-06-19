import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "100");
    const skip = (page - 1) * limit;

    const comic = await prisma.comic.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!comic) {
      return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    }

    const [chapters, total] = await Promise.all([
      prisma.chapter.findMany({
        where: { comicId: comic.id },
        orderBy: { number: "asc" },
        skip,
        take: limit,
      }),
      prisma.chapter.count({ where: { comicId: comic.id } }),
    ]);

    return NextResponse.json({
      chapters: chapters.map((ch) => ({
        id: ch.id,
        number: ch.number,
        title: ch.title,
        views: ch.views,
        publishedAt: ch.publishedAt.toISOString(),
      })),
      total,
      page,
      hasMore: skip + chapters.length < total,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch chapters" }, { status: 500 });
  }
}
