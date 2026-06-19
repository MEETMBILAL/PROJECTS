import { NextResponse } from "next/server";
import { getLatestUpdates } from "@/lib/comics";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "18");
    const data = await getLatestUpdates(page, limit);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/latest error:", error);
    return NextResponse.json({ error: "Failed to fetch latest" }, { status: 500 });
  }
}
