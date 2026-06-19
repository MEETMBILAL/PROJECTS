import { NextRequest, NextResponse } from "next/server";

import { parseCsvParam } from "@/lib/api-utils";
import { getCached } from "@/lib/cache";
import { browseComics } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const filters = {
    genres: parseCsvParam(params.get("genres")),
    status: (params.get("status") as never) || "ALL",
    type: (params.get("type") as never) || "ALL",
    sort: (params.get("sort") as never) || "latest",
  };
  const page = Number(params.get("page") ?? 1);
  const limit = Math.min(Number(params.get("limit") ?? 24), 60);

  try {
    const data = await getCached(`comics:${params.toString()}`, async () => {
      const where = {
        status: filters.status === "ALL" ? undefined : filters.status,
        type: filters.type === "ALL" ? undefined : filters.type,
        genres: filters.genres.length ? { some: { genre: { slug: { in: filters.genres } } } } : undefined,
      };
      const orderBy = filters.sort === "az" ? { title: "asc" as const } : filters.sort === "rating" ? { avgRating: "desc" as const } : filters.sort === "views" ? { totalViews: "desc" as const } : { updatedAt: "desc" as const };
      const [items, total] = await Promise.all([
        prisma.comic.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit, include: { chapters: { orderBy: { number: "desc" }, take: 3 }, genres: { include: { genre: true } } } }),
        prisma.comic.count({ where }),
      ]);
      return { items, total, page, limit };
    }, 30);
    return NextResponse.json(data);
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    const items = browseComics(filters).slice((page - 1) * limit, page * limit);
    return NextResponse.json({ items, total: browseComics(filters).length, page, limit, source: "mock" });
  }
}
