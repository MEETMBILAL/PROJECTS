export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getComics } from "@/lib/comics";
import type { ComicStatus, ComicType } from "@prisma/client";
import type { SortOption } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const filters = {
      genres: searchParams.get("genres")?.split(",").filter(Boolean),
      status: searchParams.get("status")?.split(",").filter(Boolean) as ComicStatus[] | undefined,
      type: searchParams.get("type")?.split(",").filter(Boolean) as ComicType[] | undefined,
      sort: (searchParams.get("sort") as SortOption) ?? "latest",
      page: parseInt(searchParams.get("page") ?? "1", 10),
      limit: parseInt(searchParams.get("limit") ?? "24", 10),
      search: searchParams.get("search") ?? undefined,
    };

    const result = await getComics(filters);
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/comics error:", error);
    return NextResponse.json({ error: "Failed to fetch comics" }, { status: 500 });
  }
}
