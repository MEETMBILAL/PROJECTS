import { NextResponse } from "next/server";
import { getComicBySlug } from "@/lib/comics";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const comic = await getComicBySlug(params.slug);
    if (!comic) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ comic });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
