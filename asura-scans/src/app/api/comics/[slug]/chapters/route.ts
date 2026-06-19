import { NextResponse } from "next/server";
import { getChapters } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const chapters = await getChapters(params.slug);
    return NextResponse.json({ chapters });
  } catch (err) {
    console.error("GET /api/comics/[slug]/chapters", err);
    return NextResponse.json({ error: "Failed to fetch chapters" }, { status: 500 });
  }
}
