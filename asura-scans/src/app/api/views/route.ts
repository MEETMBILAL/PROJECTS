import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { viewSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = viewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: true, demo: true });
  }

  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;
    const { comicId, chapterId } = parsed.data;

    await prisma.$transaction([
      prisma.view.create({ data: { comicId, userId } }),
      prisma.comic.update({
        where: { id: comicId },
        data: {
          totalViews: { increment: 1 },
          weeklyViews: { increment: 1 },
          monthlyViews: { increment: 1 },
        },
      }),
      ...(chapterId
        ? [prisma.chapter.update({ where: { id: chapterId }, data: { views: { increment: 1 } } })]
        : []),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/views", err);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}
