import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Removes a bookmark. The [id] segment may be either the bookmark id or the
 * comic id — both resolve to the current user's bookmark for that comic.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await prisma.bookmark.deleteMany({
      where: {
        userId: session.user.id,
        OR: [{ id: params.id }, { comicId: params.id }],
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/bookmarks/[id]]", err);
    return NextResponse.json({ error: "Failed to remove bookmark" }, { status: 500 });
  }
}
