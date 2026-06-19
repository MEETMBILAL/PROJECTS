import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const comicId = searchParams.get("comicId");

    if (comicId) {
      await prisma.bookmark.deleteMany({
        where: { userId: session.user.id, comicId },
      });
    } else if (params.id) {
      await prisma.bookmark.deleteMany({
        where: { id: params.id, userId: session.user.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to remove bookmark" }, { status: 500 });
  }
}
