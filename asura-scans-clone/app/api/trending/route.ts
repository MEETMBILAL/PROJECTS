import { NextResponse } from "next/server";

import { getCached } from "@/lib/cache";
import { trendingComics } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await getCached("trending", () => prisma.comic.findMany({ orderBy: { totalViews: "desc" }, take: 10, include: { chapters: { orderBy: { number: "desc" }, take: 3 }, genres: { include: { genre: true } } } }), 60);
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: trendingComics });
  }
}
