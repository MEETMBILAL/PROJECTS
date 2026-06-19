import { NextResponse } from "next/server";
import { getLatestUpdates } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") ?? "18");
    const items = await getLatestUpdates(limit);
    return NextResponse.json({ items, total: items.length });
  } catch (err) {
    console.error("[GET /api/latest]", err);
    return NextResponse.json({ error: "Failed to fetch latest" }, { status: 500 });
  }
}
