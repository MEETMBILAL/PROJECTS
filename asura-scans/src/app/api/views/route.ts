import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { comicId, chapterId } = await request.json();

    if (chapterId) {
      await prisma.chapter.update({
        where: { id: chapterId },
        data: { views: { increment: 1 } },
      });

      const chapter = await prisma.chapter.findUnique({
        where: { id: chapterId },
        select: { comicId: true },
      });

      if (chapter) {
        await prisma.comic.update({
          where: { id: chapter.comicId },
          data: { totalViews: { increment: 1 } },
        });

        await prisma.view.create({
          data: {
            comicId: chapter.comicId,
            userId: session?.user?.id,
          },
        });
      }
    } else if (comicId) {
      await prisma.comic.update({
        where: { id: comicId },
        data: { totalViews: { increment: 1 } },
      });

      await prisma.view.create({
        data: {
          comicId,
          userId: session?.user?.id,
        },
      });
    } else {
      return NextResponse.json({ error: "comicId or chapterId required" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/views error:", error);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}
