import { NextResponse } from "next/server";
import { searchComics } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";
    const limit = Number(searchParams.get("limit") ?? "12");
    const items = await searchComics(q, limit);
    return NextResponse.json({ items, total: items.length, query: q });
  } catch (err) {
    console.error("[GET /api/search]", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
