import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const comic = await prisma.comic.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });

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

    return NextResponse.json({ data: chapters });
  } catch (error) {
    console.error("GET /api/comics/[slug]/chapters error:", error);
    return NextResponse.json({ error: "Failed to fetch chapters" }, { status: 500 });
  }
}
