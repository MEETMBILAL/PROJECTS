import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const comic = await prisma.comic.findUnique({
      where: { slug: params.slug },
      include: {
        genres: { include: { genre: true } },
        chapters: { orderBy: { number: "desc" } },
        _count: { select: { chapters: true } },
      },
    });

    if (!comic) {
      return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: comic.id,
      slug: comic.slug,
      title: comic.title,
      altTitles: comic.altTitles,
      coverImage: comic.coverImage,
      synopsis: comic.synopsis,
      status: comic.status,
      type: comic.type,
      author: comic.author,
      artist: comic.artist,
      releaseYear: comic.releaseYear,
      totalViews: comic.totalViews,
      avgRating: comic.avgRating,
      ratingCount: comic.ratingCount,
      genres: comic.genres.map((g) => g.genre),
      chapterCount: comic._count.chapters,
      latestChapter: comic.chapters[0]?.number,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch comic" }, { status: 500 });
  }
}
