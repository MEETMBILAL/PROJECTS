import { NextResponse } from "next/server";
import { getGenres } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const genres = await getGenres();
    return NextResponse.json({ genres });
  } catch (err) {
    console.error("GET /api/genres", err);
    return NextResponse.json({ error: "Failed to fetch genres" }, { status: 500 });
  }
}
