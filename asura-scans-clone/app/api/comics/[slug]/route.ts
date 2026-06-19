import { NextResponse } from "next/server";

import { getComicBySlug } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const comic = await prisma.comic.findUnique({
      where: { slug: params.slug },
      include: { chapters: { orderBy: { number: "desc" } }, genres: { include: { genre: true } } },
    });
    if (!comic) return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    return NextResponse.json(comic);
  } catch {
    const comic = getComicBySlug(params.slug);
    if (!comic) return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    return NextResponse.json(comic);
  }
}
