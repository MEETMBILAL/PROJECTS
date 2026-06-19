import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pages = await prisma.chapterPage.findMany({
      where: { chapterId: params.id },
      orderBy: { pageNumber: "asc" },
      select: { id: true, pageNumber: true, imageUrl: true, width: true, height: true },
    });
    return NextResponse.json({ items: pages, total: pages.length });
  } catch (err) {
    console.error("[GET /api/chapters/[id]/pages]", err);
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}
