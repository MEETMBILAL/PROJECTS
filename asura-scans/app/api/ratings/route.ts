export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { comicId, score } = await request.json();
    if (!comicId || score === undefined) {
      return NextResponse.json({ error: "comicId and score are required" }, { status: 400 });
    }

    const clampedScore = Math.min(10, Math.max(0, score));

    await prisma.rating.upsert({
      where: {
        userId_comicId: { userId: session.user.id, comicId },
      },
      create: {
        userId: session.user.id,
        comicId,
        score: clampedScore,
      },
      update: { score: clampedScore },
    });

    const ratings = await prisma.rating.findMany({ where: { comicId } });
    const avgRating = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;

    await prisma.comic.update({
      where: { id: comicId },
      data: {
        avgRating,
        ratingCount: ratings.length,
      },
    });

    return NextResponse.json({ avgRating, ratingCount: ratings.length });
  } catch (error) {
    console.error("POST /api/ratings error:", error);
    return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 });
  }
}
