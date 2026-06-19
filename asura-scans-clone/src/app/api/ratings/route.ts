import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const schema = z.object({
  comicId: z.string().min(1),
  value: z.number().int().min(1).max(10),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { comicId, value } = parsed.data;

    await prisma.rating.upsert({
      where: { userId_comicId: { userId: session.user.id, comicId } },
      update: { value },
      create: { userId: session.user.id, comicId, value },
    });

    // Recompute aggregate rating
    const agg = await prisma.rating.aggregate({
      where: { comicId },
      _avg: { value: true },
      _count: true,
    });

    const updated = await prisma.comic.update({
      where: { id: comicId },
      data: {
        avgRating: agg._avg.value ?? 0,
        ratingCount: agg._count,
      },
      select: { avgRating: true, ratingCount: true },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[POST /api/ratings]", err);
    return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 });
  }
}
