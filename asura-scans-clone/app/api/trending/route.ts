import { NextResponse } from "next/server";
import { getTrendingComics } from "@/lib/comics";

export async function GET() {
  const items = await getTrendingComics();
  return NextResponse.json({ items });
}
