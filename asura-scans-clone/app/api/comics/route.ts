import { NextRequest, NextResponse } from "next/server";
import { listComics } from "@/lib/comics";
import type { ComicStatus, ComicType } from "@/types/comic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const items = await listComics({
    page: Number(searchParams.get("page") ?? 1),
    pageSize: Number(searchParams.get("pageSize") ?? 24),
    genre: searchParams.getAll("genre"),
    status: (searchParams.get("status") as ComicStatus | null) ?? undefined,
    type: (searchParams.get("type") as ComicType | null) ?? undefined,
    sort: (searchParams.get("sort") as "latest" | "az" | "rating" | "views" | null) ?? "latest",
    q: searchParams.get("q") ?? undefined
  });

  return NextResponse.json(items);
}
