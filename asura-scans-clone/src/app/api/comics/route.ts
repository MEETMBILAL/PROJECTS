import { NextResponse } from "next/server";
import { getComics } from "@/lib/comics";
import type { ComicStatus, ComicType, SortOption } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const genres = (searchParams.get("genres") ?? "").split(",").filter(Boolean);
  const status = (searchParams.get("status") ?? "ALL") as ComicStatus | "ALL";
  const type = (searchParams.get("type") ?? "ALL") as ComicType | "ALL";
  const sort = (searchParams.get("sort") ?? "latest") as SortOption;
  const q = searchParams.get("q") ?? undefined;
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "24");

  try {
    const data = await getComics({ genres, status, type, sort, q, page, limit });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { items: [], page: 1, limit, total: 0, totalPages: 1, hasMore: false },
      { status: 200 },
    );
  }
}
