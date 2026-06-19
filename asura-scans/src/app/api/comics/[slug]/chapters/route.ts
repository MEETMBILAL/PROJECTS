import { NextRequest, NextResponse } from "next/server";
import { getChaptersByComicSlug } from "@/lib/comics";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const chapters = await getChaptersByComicSlug(params.slug);
    return NextResponse.json({ data: chapters });
  } catch (error) {
    console.error("GET /api/comics/[slug]/chapters error:", error);
    return NextResponse.json({ error: "Failed to fetch chapters" }, { status: 500 });
  }
}
