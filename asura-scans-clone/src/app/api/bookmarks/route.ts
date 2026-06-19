import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  comicId: z.string().min(1),
  lastReadChapter: z.number().optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { comic: { select: { id: true, slug: true, title: true, coverImage: true } } },
  });
  return NextResponse.json({ bookmarks });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { comicId, lastReadChapter } = parsed.data;
  try {
    const bookmark = await prisma.bookmark.upsert({
      where: { userId_comicId: { userId: user.id, comicId } },
      create: { userId: user.id, comicId, lastReadChapter },
      update: { lastReadChapter },
    });
    return NextResponse.json({ bookmark }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not bookmark" }, { status: 500 });
  }
}
