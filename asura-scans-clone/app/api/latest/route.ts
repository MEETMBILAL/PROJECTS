import { NextResponse } from "next/server";

import { latestComics } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await prisma.comic.findMany({ orderBy: { updatedAt: "desc" }, take: 24, include: { chapters: { orderBy: { number: "desc" }, take: 3 }, genres: { include: { genre: true } } } });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: latestComics.slice(0, 24) });
  }
}
