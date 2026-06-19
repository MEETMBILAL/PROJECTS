import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { apiError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";

const schema = z.object({ comicId: z.string().min(1) });

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Unauthorized", 401);
  const body = schema.safeParse(await request.json());
  if (!body.success) return apiError("Invalid bookmark payload", 400);
  const bookmark = await prisma.bookmark.upsert({
    where: { userId_comicId: { userId: session.user.id, comicId: body.data.comicId } },
    update: {},
    create: { userId: session.user.id, comicId: body.data.comicId },
  });
  return NextResponse.json({ bookmark });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Unauthorized", 401);
  const body = schema.safeParse(await request.json());
  if (!body.success) return apiError("Invalid bookmark payload", 400);
  await prisma.bookmark.deleteMany({ where: { userId: session.user.id, comicId: body.data.comicId } });
  return NextResponse.json({ ok: true });
}
