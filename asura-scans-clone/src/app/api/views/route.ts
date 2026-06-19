import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  comicId: z.string().min(1),
  chapterId: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { comicId, chapterId } = parsed.data;
  const user = await getCurrentUser().catch(() => null);

  try {
    await prisma.$transaction([
      prisma.view.create({ data: { comicId, userId: user?.id ?? null } }),
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
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not record view" }, { status: 500 });
  }
}
