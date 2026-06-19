import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getComicBySlug } from "@/lib/data";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/bookmarks/[id] — remove a bookmark.
 * `id` may be a bookmark id or a comic slug.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json({ ok: true });
    }

    const userId = (session.user as { id: string }).id;
    const { id } = params;

    // Try delete by composite (userId + comicId via slug) first, then by id.
    const comic = await getComicBySlug(id);
    if (comic) {
      await prisma.bookmark.deleteMany({
        where: { userId, comicId: comic.id },
      });
    } else {
      await prisma.bookmark.deleteMany({ where: { id, userId } });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/bookmarks/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to remove bookmark" },
      { status: 500 }
    );
  }
}
