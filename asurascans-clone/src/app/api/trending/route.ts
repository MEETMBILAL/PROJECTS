import { NextResponse } from "next/server";

import { getTrending } from "@/lib/data";
import { cached } from "@/lib/redis";

export const dynamic = "force-dynamic";

/** GET /api/trending — top 10 trending comics (cached 60s). */
export async function GET() {
  try {
    const items = await cached("trending:10", 60, () => getTrending(10));
    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/trending error:", error);
    return NextResponse.json(
      { error: "Failed to load trending" },
      { status: 500 }
    );
  }
}
