import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  comicId: z.string().min(1),
  value: z.number().int().min(1).max(10),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { comicId, value } = parsed.data;

  try {
    await prisma.rating.upsert({
      where: { userId_comicId: { userId: user.id, comicId } },
      create: { userId: user.id, comicId, value },
      update: { value },
    });

    // Recompute aggregate rating.
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

    return NextResponse.json({ rating: value, ...updated });
  } catch {
    return NextResponse.json({ error: "Could not submit rating" }, { status: 500 });
  }
}
