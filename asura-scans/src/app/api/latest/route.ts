import { NextResponse } from "next/server";
import { getLatest } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(60, Number(searchParams.get("limit") ?? "18"));
    const comics = await getLatest(limit);
    return NextResponse.json({ comics });
  } catch (err) {
    console.error("GET /api/latest", err);
    return NextResponse.json({ error: "Failed to fetch latest" }, { status: 500 });
  }
}
