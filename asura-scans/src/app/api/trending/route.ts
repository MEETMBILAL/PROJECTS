import { NextResponse } from "next/server";
import { getTrending } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(20, Number(searchParams.get("limit") ?? "10"));
    const comics = await getTrending(limit);
    return NextResponse.json({ comics });
  } catch (err) {
    console.error("GET /api/trending", err);
    return NextResponse.json({ error: "Failed to fetch trending" }, { status: 500 });
  }
}
