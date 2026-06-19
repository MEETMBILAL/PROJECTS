import { NextRequest, NextResponse } from "next/server";

import { getLatest } from "@/lib/data";
import { cached } from "@/lib/redis";

export const dynamic = "force-dynamic";

/** GET /api/latest — latest updated comics (cached 30s). */
export async function GET(req: NextRequest) {
  try {
    const limit = Math.min(
      48,
      Math.max(1, Number(req.nextUrl.searchParams.get("limit")) || 18)
    );
    const items = await cached(`latest:${limit}`, 30, () => getLatest(limit));
    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/latest error:", error);
    return NextResponse.json(
      { error: "Failed to load latest" },
      { status: 500 }
    );
  }
}
