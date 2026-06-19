import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const schema = z.object({
  comicId: z.string().min(1),
  chapterId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { comicId, chapterId } = parsed.data;
    const session = await auth();

    await prisma.$transaction([
      prisma.view.create({
        data: { comicId, userId: session?.user?.id ?? null },
      }),
      prisma.comic.update({
        where: { id: comicId },
        data: {
          totalViews: { increment: 1 },
          weeklyViews: { increment: 1 },
          monthlyViews: { increment: 1 },
        },
      }),
      ...(chapterId
        ? [
            prisma.chapter.update({
              where: { id: chapterId },
              data: { views: { increment: 1 } },
            }),
          ]
        : []),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/views]", err);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}
