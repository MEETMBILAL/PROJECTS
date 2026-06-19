import { NextRequest, NextResponse } from "next/server";
import { searchComicsDb } from "@/lib/comics";
import { searchComics } from "@/lib/meilisearch";

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q") ?? "";
    if (!q.trim()) {
      return NextResponse.json({ data: [] });
    }

    let data;
    const meiliResult = await searchComics(q);
    if (meiliResult?.hits?.length) {
      data = meiliResult.hits;
    } else {
      data = await searchComicsDb(q);
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
