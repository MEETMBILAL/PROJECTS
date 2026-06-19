import { NextResponse } from "next/server";
import { getComicBySlug } from "@/lib/comics";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const comic = await getComicBySlug(params.slug);
    if (!comic) {
      return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    }
    return NextResponse.json(comic);
  } catch (error) {
    console.error("GET /api/comics/[slug] error:", error);
    return NextResponse.json({ error: "Failed to fetch comic" }, { status: 500 });
  }
}
