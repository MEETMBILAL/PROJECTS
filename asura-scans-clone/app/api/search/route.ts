import { NextRequest, NextResponse } from "next/server";

import { searchIndex } from "@/lib/search";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const items = await searchIndex(query);
  return NextResponse.json({ items });
}
