import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const prisma = getPrisma();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!prisma) {
    return NextResponse.json({ ok: true, mode: "demo" });
  }

  const body = (await request.json()) as { comicId?: string; lastReadChapter?: number };

  if (!body.comicId) {
    return NextResponse.json({ error: "comicId is required" }, { status: 400 });
  }

  const bookmark = await prisma.bookmark.upsert({
    where: {
      userId_comicId: {
        userId: session.user.id,
        comicId: body.comicId
      }
    },
    create: {
      userId: session.user.id,
      comicId: body.comicId,
      lastReadChapter: body.lastReadChapter
    },
    update: {
      lastReadChapter: body.lastReadChapter
    }
  });

  return NextResponse.json(bookmark, { status: 201 });
}
