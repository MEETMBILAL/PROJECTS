import { NextResponse } from "next/server";
import { getTrendingComics } from "@/lib/comics";

export async function GET() {
  try {
    const data = await getTrendingComics();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/trending error:", error);
    return NextResponse.json({ error: "Failed to fetch trending" }, { status: 500 });
  }
}
