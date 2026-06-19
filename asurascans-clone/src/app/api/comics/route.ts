import { NextRequest, NextResponse } from "next/server";

import { getComics } from "@/lib/data";
import { parseFilters } from "@/lib/parse-filters";

export const dynamic = "force-dynamic";

/** GET /api/comics — list comics with filters & pagination. */
export async function GET(req: NextRequest) {
  try {
    const filters = parseFilters(req.nextUrl.searchParams);
    const data = await getComics(filters);
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/comics error:", error);
    return NextResponse.json(
      { error: "Failed to load comics" },
      { status: 500 }
    );
  }
}
