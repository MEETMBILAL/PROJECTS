import { NextResponse } from "next/server";
import { getComicBySlug, getChaptersForComic } from "@/lib/comics";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const comic = await getComicBySlug(params.slug);
    if (!comic) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const chapters = await getChaptersForComic(comic.id);
    return NextResponse.json({ chapters });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
