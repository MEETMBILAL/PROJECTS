import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { ratingSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = ratingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: true, demo: true, value: parsed.data.value });
  }

  try {
    const userId = (session.user as { id?: string }).id!;
    const { comicId, value } = parsed.data;

    await prisma.rating.upsert({
      where: { userId_comicId: { userId, comicId } },
      create: { userId, comicId, value },
      update: { value },
    });

    // Recompute aggregate rating.
    const agg = await prisma.rating.aggregate({
      where: { comicId },
      _avg: { value: true },
      _count: true,
    });
    const avgRating = agg._avg.value ?? 0;
    await prisma.comic.update({
      where: { id: comicId },
      data: { avgRating, ratingCount: agg._count },
    });

    return NextResponse.json({ ok: true, avgRating, ratingCount: agg._count });
  } catch (err) {
    console.error("POST /api/ratings", err);
    return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 });
  }
}
