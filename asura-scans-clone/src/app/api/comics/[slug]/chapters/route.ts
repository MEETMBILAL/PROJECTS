import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getChapters } from "@/lib/queries";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const comic = await prisma.comic.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });
    if (!comic) {
      return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    }
    const chapters = await getChapters(comic.id);
    return NextResponse.json({ items: chapters, total: chapters.length });
  } catch (err) {
    console.error("[GET /api/comics/[slug]/chapters]", err);
    return NextResponse.json({ error: "Failed to fetch chapters" }, { status: 500 });
  }
}
