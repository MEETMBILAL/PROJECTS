import { NextResponse } from "next/server";
import { getChapterPagesById } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const pages = await getChapterPagesById(params.id);
    if (!pages) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }
    return NextResponse.json({ pages });
  } catch (err) {
    console.error("GET /api/chapters/[id]/pages", err);
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}
