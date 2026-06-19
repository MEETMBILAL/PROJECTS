import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ComicStatus, ComicType, Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "24");
    const genres = searchParams.get("genres")?.split(",").filter(Boolean) ?? [];
    const status = searchParams.get("status") as ComicStatus | null;
    const type = searchParams.get("type") as ComicType | null;
    const sort = searchParams.get("sort") ?? "latest";
    const skip = (page - 1) * limit;

    const where: Prisma.ComicWhereInput = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (genres.length) {
      where.genres = { some: { genre: { slug: { in: genres } } } };
    }

    const orderBy: Prisma.ComicOrderByWithRelationInput =
      sort === "az"
        ? { title: "asc" }
        : sort === "rating"
          ? { avgRating: "desc" }
          : sort === "views"
            ? { totalViews: "desc" }
            : { updatedAt: "desc" };

    const [comics, total] = await Promise.all([
      prisma.comic.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          chapters: { orderBy: { number: "desc" }, take: 1 },
        },
      }),
      prisma.comic.count({ where }),
    ]);

    return NextResponse.json({
      comics: comics.map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        coverImage: c.coverImage,
        avgRating: c.avgRating,
        status: c.status,
        type: c.type,
        latestChapter: c.chapters[0]?.number,
      })),
      total,
      page,
      hasMore: skip + comics.length < total,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch comics" }, { status: 500 });
  }
}
