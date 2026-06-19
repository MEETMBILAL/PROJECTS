import { NextResponse } from "next/server";
import { getComicChapters } from "@/lib/comics";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const chapters = await getComicChapters(params.slug);
  return NextResponse.json({ items: chapters, total: chapters.length });
}
