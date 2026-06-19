import { NextResponse } from "next/server";
import { searchComics } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";
    const limit = Math.min(30, Number(searchParams.get("limit") ?? "8"));
    const results = await searchComics(q, limit);
    return NextResponse.json({ results, query: q });
  } catch (err) {
    console.error("GET /api/search", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
