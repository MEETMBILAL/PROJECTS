import { NextResponse } from "next/server";
import { getComics } from "@/lib/queries";
import type { SortOption } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const genres = searchParams.getAll("genre").flatMap((g) => g.split(","));
    const result = await getComics({
      genres: genres.filter(Boolean),
      status: searchParams.get("status") ?? undefined,
      type: searchParams.get("type") ?? undefined,
      sort: (searchParams.get("sort") as SortOption) ?? undefined,
      search: searchParams.get("q") ?? undefined,
      page: Number(searchParams.get("page") ?? "1"),
      pageSize: searchParams.get("pageSize")
        ? Number(searchParams.get("pageSize"))
        : undefined,
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[GET /api/comics]", err);
    return NextResponse.json({ error: "Failed to fetch comics" }, { status: 500 });
  }
}
