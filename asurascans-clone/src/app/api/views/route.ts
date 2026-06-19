import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getComicBySlug } from "@/lib/data";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** POST /api/views — increment a comic's view count { slug, chapterId? }. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const slug: string | undefined = body.slug;
    const chapterId: string | undefined = body.chapterId;

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json({ ok: true });
    }

    const comic = await getComicBySlug(slug);
    if (!comic) {
      return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user
      ? (session.user as { id: string }).id
      : null;

    await prisma.$transaction([
      prisma.view.create({
        data: { comicId: comic.id, userId, chapterId: chapterId ?? null },
      }),
      prisma.comic.update({
        where: { id: comic.id },
        data: { totalViews: { increment: 1 } },
      }),
      ...(chapterId
        ? [
            prisma.chapter.update({
              where: { id: chapterId },
              data: { views: { increment: 1 } },
            }),
          ]
        : []),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/views error:", error);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}
