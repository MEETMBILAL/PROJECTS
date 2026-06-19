import { NextResponse } from "next/server";

import { comics } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const pages = await prisma.chapterPage.findMany({ where: { chapterId: params.id }, orderBy: { pageNumber: "asc" } });
    if (!pages.length) return NextResponse.json({ error: "Pages not found" }, { status: 404 });
    return NextResponse.json({ pages });
  } catch {
    const chapter = comics.flatMap((comic) => comic.chapters).find((item) => item.id === params.id);
    if (!chapter?.pages) return NextResponse.json({ error: "Pages not found" }, { status: 404 });
    return NextResponse.json({ pages: chapter.pages });
  }
}
