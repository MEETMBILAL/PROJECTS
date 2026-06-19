import { NextResponse } from "next/server";
import { searchComics } from "@/lib/meilisearch";
import { searchComicsPrisma } from "@/lib/comics";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    if (!q) {
      return NextResponse.json({ data: [] });
    }

    const meiliResults = await searchComics(q);
    if (meiliResults) {
      return NextResponse.json({ data: meiliResults });
    }

    const data = await searchComicsPrisma(q);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
