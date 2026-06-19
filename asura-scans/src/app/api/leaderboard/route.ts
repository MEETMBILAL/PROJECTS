import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/comics";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get("period") ?? "weekly") as "weekly" | "monthly" | "alltime";
    const data = await getLeaderboard(period);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/leaderboard error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
