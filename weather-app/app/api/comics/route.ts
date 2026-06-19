import { NextRequest, NextResponse } from "next/server";

import { getCachedJson, setCachedJson } from "@/lib/cache";
import { queryComics, type ComicQuery, type ComicStatus, type ComicType } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query: ComicQuery = {
    genres: params.get("genre") ? [params.get("genre")!] : undefined,
    status: (params.get("status") as ComicStatus) ?? "ALL",
    type: (params.get("type") as ComicType) ?? "ALL",
    sort: (params.get("sort") as ComicQuery["sort"]) ?? "latest",
    q: params.get("q") ?? undefined,
    page: Number(params.get("page") ?? 1),
    pageSize: Number(params.get("pageSize") ?? 24),
  };
  const cacheKey = `comics:${JSON.stringify(query)}`;
  const cached = await getCachedJson<ReturnType<typeof queryComics>>(cacheKey);
  if (cached) return NextResponse.json(cached);

  const result = queryComics(query);
  await setCachedJson(cacheKey, result, 45);
  return NextResponse.json(result);
}
