import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const period = (searchParams.get("period") ?? "weekly") as
      | "weekly"
      | "monthly"
      | "all";
    const limit = Number(searchParams.get("limit") ?? "30");
    const items = await getLeaderboard(period, limit);
    return NextResponse.json({ items, total: items.length, period });
  } catch (err) {
    console.error("[GET /api/leaderboard]", err);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
