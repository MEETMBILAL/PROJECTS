import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { comicId } = await request.json();
    if (!comicId) {
      return NextResponse.json({ error: "comicId is required" }, { status: 400 });
    }

    const existing = await prisma.bookmark.findUnique({
      where: { userId_comicId: { userId: session.user.id, comicId } },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    const bookmark = await prisma.bookmark.create({
      data: { userId: session.user.id, comicId },
    });

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookmarks error:", error);
    return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 });
  }
}
