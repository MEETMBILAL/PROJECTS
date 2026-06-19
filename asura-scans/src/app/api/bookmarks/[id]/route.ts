import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** `id` is the comicId being un-bookmarked for the current user. */
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: true, demo: true });
  }
  try {
    const userId = (session.user as { id?: string }).id!;
    await prisma.bookmark.deleteMany({ where: { userId, comicId: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/bookmarks/[id]", err);
    return NextResponse.json({ error: "Failed to remove bookmark" }, { status: 500 });
  }
}
