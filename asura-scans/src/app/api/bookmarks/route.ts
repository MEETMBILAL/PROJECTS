import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { bookmarkSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ bookmarks: [] });
  }
  try {
    const userId = (session.user as { id?: string }).id;
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: { comic: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ bookmarks });
  } catch (err) {
    console.error("GET /api/bookmarks", err);
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = bookmarkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Demo mode: acknowledge without persistence (client store is source of truth).
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: true, demo: true });
  }

  try {
    const userId = (session.user as { id?: string }).id!;
    const bookmark = await prisma.bookmark.upsert({
      where: { userId_comicId: { userId, comicId: parsed.data.comicId } },
      create: {
        userId,
        comicId: parsed.data.comicId,
        lastReadChapter: parsed.data.lastReadChapter,
      },
      update: { lastReadChapter: parsed.data.lastReadChapter },
    });
    return NextResponse.json({ bookmark }, { status: 201 });
  } catch (err) {
    console.error("POST /api/bookmarks", err);
    return NextResponse.json({ error: "Failed to add bookmark" }, { status: 500 });
  }
}
