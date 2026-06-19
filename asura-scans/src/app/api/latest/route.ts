import { NextRequest, NextResponse } from "next/server";
import { getLatestUpdates } from "@/lib/comics";

export async function GET(request: NextRequest) {
  try {
    const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "24");
    const data = await getLatestUpdates(limit);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/latest error:", error);
    return NextResponse.json({ error: "Failed to fetch latest" }, { status: 500 });
  }
}
