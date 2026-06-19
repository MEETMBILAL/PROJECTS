import { NextResponse } from "next/server";

import { getChapterPages } from "@/lib/data";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/chapters/[id]/pages — image URLs for the reader.
 *
 * `id` may be a database chapter id, or the composite `"<slug>_ch_<number>"`
 * id used by the in-memory dataset.
 */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const composite = id.match(/^(.+)_ch_([\d.]+)$/);

    if (composite) {
      const slug = composite[1];
      const number = Number(composite[2]);
      const pages = await getChapterPages(slug, number);
      return NextResponse.json({ chapterId: id, pages });
    }

    if (isDatabaseConfigured()) {
      const chapter = await prisma.chapter.findUnique({
        where: { id },
        include: {
          pages: { orderBy: { index: "asc" } },
          comic: { select: { slug: true } },
        },
      });
      if (!chapter) {
        return NextResponse.json(
          { error: "Chapter not found" },
          { status: 404 }
        );
      }
      const pages = chapter.pages.length
        ? chapter.pages.map((p) => p.imageUrl)
        : await getChapterPages(chapter.comic.slug, chapter.number);
      return NextResponse.json({ chapterId: id, pages });
    }

    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  } catch (error) {
    console.error("GET /api/chapters/[id]/pages error:", error);
    return NextResponse.json(
      { error: "Failed to load pages" },
      { status: 500 }
    );
  }
}
