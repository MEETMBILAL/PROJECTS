import { NextResponse } from "next/server";
import { getPagesForChapter } from "@/lib/mock-data";
import { getPrisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const prisma = getPrisma();

  if (!prisma) {
    return NextResponse.json({ items: getPagesForChapter(params.id) });
  }

  const pages = await prisma.chapterPage.findMany({
    where: { chapterId: params.id },
    orderBy: { pageIndex: "asc" }
  });

  return NextResponse.json({ items: pages });
}
