import { NextResponse } from "next/server";

import { getCachedJson, setCachedJson } from "@/lib/cache";
import { getLatestComics } from "@/lib/mock-data";

export async function GET() {
  const cached = await getCachedJson<ReturnType<typeof getLatestComics>>("latest:comics");
  if (cached) return NextResponse.json({ comics: cached });

  const comics = getLatestComics(24);
  await setCachedJson("latest:comics", comics, 45);
  return NextResponse.json({ comics });
}
