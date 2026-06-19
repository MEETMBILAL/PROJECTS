export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pages = await prisma.chapterPage.findMany({
      where: { chapterId: params.id },
      orderBy: { pageNum: "asc" },
      select: { id: true, pageNum: true, imageUrl: true },
    });

    if (pages.length === 0) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    return NextResponse.json({ pages });
  } catch (error) {
    console.error("GET /api/chapters/[id]/pages error:", error);
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}
