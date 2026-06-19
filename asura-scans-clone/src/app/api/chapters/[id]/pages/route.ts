import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const pages = await prisma.chapterPage.findMany({
      where: { chapterId: params.id },
      orderBy: { index: "asc" },
      select: { id: true, index: true, imageUrl: true, width: true, height: true },
    });
    return NextResponse.json({ pages });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
