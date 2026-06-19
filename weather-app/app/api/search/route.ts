import { NextRequest, NextResponse } from "next/server";

import { searchComics } from "@/lib/search";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const results = await searchComics(query);
  return NextResponse.json({ results });
}
