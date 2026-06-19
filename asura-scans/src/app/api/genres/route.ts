import { NextResponse } from "next/server";
import { getAllGenres } from "@/lib/data";

export async function GET() {
  try {
    const genres = await getAllGenres();
    return NextResponse.json({ genres });
  } catch {
    return NextResponse.json({ genres: [] });
  }
}
