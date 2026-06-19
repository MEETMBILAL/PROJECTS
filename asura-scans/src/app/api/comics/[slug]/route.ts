import { NextRequest, NextResponse } from "next/server";
import { getComicBySlug, getRelatedComics } from "@/lib/comics";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const comic = await getComicBySlug(params.slug);
    if (!comic) {
      return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    }

    const related = await getRelatedComics(comic.id);
    return NextResponse.json({ ...comic, related });
  } catch (error) {
    console.error("GET /api/comics/[slug] error:", error);
    return NextResponse.json({ error: "Failed to fetch comic" }, { status: 500 });
  }
}
