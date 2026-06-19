import { NextRequest, NextResponse } from "next/server";

import { searchComics } from "@/lib/data";

export const dynamic = "force-dynamic";

/** GET /api/search?q= — search comics by title/author. */
export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") ?? "";
    const limit = Math.min(
      20,
      Math.max(1, Number(req.nextUrl.searchParams.get("limit")) || 8)
    );
    const items = await searchComics(q, limit);
    return NextResponse.json({ items, query: q });
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
