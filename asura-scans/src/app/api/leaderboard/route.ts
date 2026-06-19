import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/data";
import type { LeaderboardPeriod } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const period = (searchParams.get("period")?.toUpperCase() as LeaderboardPeriod) || "WEEKLY";
    const valid: LeaderboardPeriod[] = ["WEEKLY", "MONTHLY", "ALL_TIME"];
    const entries = await getLeaderboard(valid.includes(period) ? period : "WEEKLY", 20);
    return NextResponse.json({ entries });
  } catch (err) {
    console.error("GET /api/leaderboard", err);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
