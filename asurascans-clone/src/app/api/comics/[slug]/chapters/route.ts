import { NextRequest, NextResponse } from "next/server";

import { getComicBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

/** GET /api/comics/[slug]/chapters — chapter list (filterable + sortable). */
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const comic = await getComicBySlug(params.slug);
    if (!comic) {
      return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    }

    const sp = req.nextUrl.searchParams;
    const order = sp.get("order") === "asc" ? "asc" : "desc";
    const q = sp.get("q")?.toLowerCase().trim();
    const page = Math.max(1, Number(sp.get("page")) || 1);
    const perPage = Math.min(200, Math.max(1, Number(sp.get("perPage")) || 100));

    let chapters = [...comic.chapters];
    if (q) {
      chapters = chapters.filter(
        (c) =>
          String(c.number).includes(q) ||
          (c.title ?? "").toLowerCase().includes(q)
      );
    }
    chapters.sort((a, b) =>
      order === "asc" ? a.number - b.number : b.number - a.number
    );

    const total = chapters.length;
    const start = (page - 1) * perPage;
    const items = chapters.slice(start, start + perPage);

    return NextResponse.json({
      items,
      total,
      page,
      perPage,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    });
  } catch (error) {
    console.error("GET /api/comics/[slug]/chapters error:", error);
    return NextResponse.json(
      { error: "Failed to load chapters" },
      { status: 500 }
    );
  }
}
