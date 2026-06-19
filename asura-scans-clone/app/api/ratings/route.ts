import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { apiError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";

const schema = z.object({ comicId: z.string().min(1), value: z.number().int().min(1).max(10) });

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Unauthorized", 401);
  const body = schema.safeParse(await request.json());
  if (!body.success) return apiError("Invalid rating payload", 400);

  const rating = await prisma.rating.upsert({
    where: { userId_comicId: { userId: session.user.id, comicId: body.data.comicId } },
    update: { value: body.data.value },
    create: { userId: session.user.id, comicId: body.data.comicId, value: body.data.value },
  });
  const aggregate = await prisma.rating.aggregate({ where: { comicId: body.data.comicId }, _avg: { value: true }, _count: { value: true } });
  await prisma.comic.update({ where: { id: body.data.comicId }, data: { avgRating: aggregate._avg.value ?? 0, ratingCount: aggregate._count.value } });
  return NextResponse.json({ rating });
}
