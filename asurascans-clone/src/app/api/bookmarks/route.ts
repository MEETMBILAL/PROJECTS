import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getComicBySlug } from "@/lib/data";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** GET /api/bookmarks — current user's bookmarks. */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDatabaseConfigured()) {
    // Demo mode: bookmarks live in client localStorage.
    return NextResponse.json({ items: [] });
  }
  const items = await prisma.bookmark.findMany({
    where: { userId: (session.user as { id: string }).id },
    include: { comic: { include: { chapters: { orderBy: { number: "desc" }, take: 1 } } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ items });
}

/** POST /api/bookmarks — add a bookmark { slug }. */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const slug: string | undefined = body.slug;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    if (!isDatabaseConfigured()) {
      // Demo mode: client store is the source of truth.
      return NextResponse.json({ ok: true, slug });
    }

    const comic = await getComicBySlug(slug);
    if (!comic) {
      return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    }

    const userId = (session.user as { id: string }).id;
    const bookmark = await prisma.bookmark.upsert({
      where: { userId_comicId: { userId, comicId: comic.id } },
      create: { userId, comicId: comic.id },
      update: {},
    });
    return NextResponse.json({ ok: true, bookmark });
  } catch (error) {
    console.error("POST /api/bookmarks error:", error);
    return NextResponse.json({ error: "Failed to bookmark" }, { status: 500 });
  }
}
