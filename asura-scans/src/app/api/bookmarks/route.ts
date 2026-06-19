import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { comicId } = await request.json();
    if (!comicId) {
      return NextResponse.json({ error: "comicId required" }, { status: 400 });
    }

    const bookmark = await prisma.bookmark.upsert({
      where: {
        userId_comicId: { userId: session.user.id, comicId },
      },
      create: { userId: session.user.id, comicId },
      update: {},
    });

    return NextResponse.json(bookmark);
  } catch (error) {
    console.error("POST /api/bookmarks error:", error);
    return NextResponse.json({ error: "Failed to add bookmark" }, { status: 500 });
  }
}
