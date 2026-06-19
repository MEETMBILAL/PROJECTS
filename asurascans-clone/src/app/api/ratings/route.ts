import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getComicBySlug } from "@/lib/data";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** POST /api/ratings — submit a star rating { slug, value (1-10) }. */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const slug: string | undefined = body.slug;
    const value = Number(body.value);

    if (!slug || !Number.isFinite(value) || value < 1 || value > 10) {
      return NextResponse.json(
        { error: "Invalid rating payload" },
        { status: 400 }
      );
    }

    if (!isDatabaseConfigured()) {
      // Demo mode: acknowledge without persisting.
      return NextResponse.json({ ok: true, value });
    }

    const comic = await getComicBySlug(slug);
    if (!comic) {
      return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    }

    const userId = (session.user as { id: string }).id;
    await prisma.rating.upsert({
      where: { userId_comicId: { userId, comicId: comic.id } },
      create: { userId, comicId: comic.id, value: Math.round(value) },
      update: { value: Math.round(value) },
    });

    // Recompute aggregate rating.
    const agg = await prisma.rating.aggregate({
      where: { comicId: comic.id },
      _avg: { value: true },
      _count: true,
    });
    const updated = await prisma.comic.update({
      where: { id: comic.id },
      data: {
        avgRating: agg._avg.value ?? 0,
        ratingCount: agg._count,
      },
      select: { avgRating: true, ratingCount: true },
    });

    return NextResponse.json({ ok: true, ...updated });
  } catch (error) {
    console.error("POST /api/ratings error:", error);
    return NextResponse.json({ error: "Failed to rate" }, { status: 500 });
  }
}
