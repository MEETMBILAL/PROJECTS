import { NextResponse } from "next/server";
import { getComics } from "@/lib/data";
import type { ComicFilters, ComicStatus, ComicType } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filters: ComicFilters = {
      genres: searchParams.get("genres")?.split(",").filter(Boolean),
      status: (searchParams.get("status") as ComicStatus) || undefined,
      type: (searchParams.get("type") as ComicType) || undefined,
      sort: (searchParams.get("sort") as ComicFilters["sort"]) || "latest",
      search: searchParams.get("q") || undefined,
      page: Number(searchParams.get("page") ?? "1"),
      pageSize: Number(searchParams.get("pageSize") ?? "24"),
    };
    const result = await getComics(filters);
    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/comics", err);
    return NextResponse.json({ error: "Failed to fetch comics" }, { status: 500 });
  }
}
