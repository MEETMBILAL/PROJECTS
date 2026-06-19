import { createHash } from "crypto";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const prisma = getPrisma();
  const body = (await request.json()) as { comicId?: string; chapterId?: string };

  if (!body.comicId) {
    return NextResponse.json({ error: "comicId is required" }, { status: 400 });
  }

  if (!prisma) {
    return NextResponse.json({ ok: true, mode: "demo" });
  }

  const session = await getServerSession(authOptions);
  const headerStore = headers();
  const forwardedFor = headerStore.get("x-forwarded-for") ?? "anonymous";
  const ipHash = createHash("sha256").update(forwardedFor).digest("hex");

  await prisma.$transaction([
    prisma.view.create({
      data: {
        userId: session?.user?.id,
        comicId: body.comicId,
        chapterId: body.chapterId,
        ipHash
      }
    }),
    prisma.comic.update({
      where: { id: body.comicId },
      data: { totalViews: { increment: 1 } }
    }),
    ...(body.chapterId
      ? [
          prisma.chapter.update({
            where: { id: body.chapterId },
            data: { views: { increment: 1 } }
          })
        ]
      : [])
  ]);

  return NextResponse.json({ ok: true });
}
