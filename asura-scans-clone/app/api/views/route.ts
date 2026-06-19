import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { apiError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";

const schema = z.object({ comicId: z.string().min(1), chapterId: z.string().optional() });

export async function POST(request: NextRequest) {
  const body = schema.safeParse(await request.json());
  if (!body.success) return apiError("Invalid view payload", 400);
  const session = await getServerSession(authOptions);
  const view = await prisma.view.create({ data: { comicId: body.data.comicId, chapterId: body.data.chapterId, userId: session?.user?.id } });
  await prisma.comic.update({ where: { id: body.data.comicId }, data: { totalViews: { increment: 1 } } });
  if (body.data.chapterId) await prisma.chapter.update({ where: { id: body.data.chapterId }, data: { views: { increment: 1 } } });
  return NextResponse.json({ view });
}
