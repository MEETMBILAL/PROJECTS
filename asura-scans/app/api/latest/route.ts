export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getLatestComics } from "@/lib/comics";

export async function GET(request: NextRequest) {
  try {
    const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "24", 10);
    const comics = await getLatestComics(limit);
    return NextResponse.json({ comics });
  } catch (error) {
    console.error("GET /api/latest error:", error);
    return NextResponse.json({ error: "Failed to fetch latest" }, { status: 500 });
  }
}
