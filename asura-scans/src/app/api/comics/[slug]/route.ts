import { NextResponse } from "next/server";
import { getComicBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const comic = await getComicBySlug(params.slug);
    if (!comic) {
      return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    }
    return NextResponse.json(comic);
  } catch (err) {
    console.error("GET /api/comics/[slug]", err);
    return NextResponse.json({ error: "Failed to fetch comic" }, { status: 500 });
  }
}
