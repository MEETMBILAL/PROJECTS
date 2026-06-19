import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/bookmarks/[id]
 * `id` may be either the Bookmark id or the Comic id for the current user.
 */
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = await prisma.bookmark.deleteMany({
      where: {
        userId: user.id,
        OR: [{ id: params.id }, { comicId: params.id }],
      },
    });
    if (result.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not remove bookmark" }, { status: 500 });
  }
}
