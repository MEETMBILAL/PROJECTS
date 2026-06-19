import { NextRequest, NextResponse } from "next/server";
import { getLatestComics } from "@/lib/comics";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const items = await getLatestComics(Number(searchParams.get("limit") ?? 18));
  return NextResponse.json({ items });
}
