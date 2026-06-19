import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const prisma = getPrisma();
  const body = (await request.json()) as { comicId?: string; value?: number };

  if (!body.comicId || !body.value || body.value < 1 || body.value > 10) {
    return NextResponse.json({ error: "comicId and value 1-10 are required" }, { status: 400 });
  }

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!prisma) {
    return NextResponse.json({ ok: true, mode: "demo" });
  }

  await prisma.rating.upsert({
    where: {
      userId_comicId: {
        userId: session.user.id,
        comicId: body.comicId
      }
    },
    create: {
      userId: session.user.id,
      comicId: body.comicId,
      value: body.value
    },
    update: {
      value: body.value
    }
  });

  const aggregate = await prisma.rating.aggregate({
    where: { comicId: body.comicId },
    _avg: { value: true },
    _count: true
  });

  const comic = await prisma.comic.update({
    where: { id: body.comicId },
    data: {
      avgRating: aggregate._avg.value ?? 0,
      ratingCount: aggregate._count
    }
  });

  return NextResponse.json({ avgRating: comic.avgRating, ratingCount: comic.ratingCount });
}
