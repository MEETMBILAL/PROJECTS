import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { comicId, score } = await request.json();
    if (!comicId || typeof score !== "number" || score < 0 || score > 10) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    await prisma.rating.upsert({
      where: { userId_comicId: { userId: session.user.id, comicId } },
      create: { userId: session.user.id, comicId, score },
      update: { score },
    });

    const ratings = await prisma.rating.findMany({
      where: { comicId },
      select: { score: true },
    });

    const avgRating = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;

    await prisma.comic.update({
      where: { id: comicId },
      data: { avgRating, ratingCount: ratings.length },
    });

    return NextResponse.json({ avgRating, ratingCount: ratings.length });
  } catch (error) {
    console.error("POST /api/ratings error:", error);
    return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 });
  }
}
