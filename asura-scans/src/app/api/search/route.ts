import { NextResponse } from "next/server";
import { searchComics } from "@/lib/search";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? "";
    if (!q.trim()) {
      return NextResponse.json({ results: [] });
    }
    const results = await searchComics(q);
    return NextResponse.json({ results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
