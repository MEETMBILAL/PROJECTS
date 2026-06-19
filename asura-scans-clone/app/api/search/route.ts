import { NextRequest, NextResponse } from "next/server";
import { searchComics } from "@/lib/search";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const items = await searchComics(searchParams.get("q") ?? "", 10);

  return NextResponse.json({ items });
}
