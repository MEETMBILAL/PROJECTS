import { NextResponse } from "next/server";

import { getCachedJson, setCachedJson } from "@/lib/cache";
import { getTrendingComics } from "@/lib/mock-data";

export async function GET() {
  const cached = await getCachedJson<ReturnType<typeof getTrendingComics>>("trending:top10");
  if (cached) return NextResponse.json({ comics: cached });

  const comics = getTrendingComics(10);
  await setCachedJson("trending:top10", comics, 60);
  return NextResponse.json({ comics });
}
