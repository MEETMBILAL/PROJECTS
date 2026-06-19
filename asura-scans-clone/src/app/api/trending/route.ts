import { NextResponse } from "next/server";
import { getTrending } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") ?? "10");
    const items = await getTrending(limit);
    return NextResponse.json({ items, total: items.length });
  } catch (err) {
    console.error("[GET /api/trending]", err);
    return NextResponse.json({ error: "Failed to fetch trending" }, { status: 500 });
  }
}
