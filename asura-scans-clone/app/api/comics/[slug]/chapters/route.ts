import { NextResponse } from "next/server";

import { getComicBySlug } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const comic = await prisma.comic.findUnique({ where: { slug: params.slug }, select: { id: true } });
    if (!comic) return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    const chapters = await prisma.chapter.findMany({ where: { comicId: comic.id }, orderBy: { number: "desc" } });
    return NextResponse.json({ chapters });
  } catch {
    const comic = getComicBySlug(params.slug);
    if (!comic) return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    return NextResponse.json({ chapters: comic.chapters });
  }
}
