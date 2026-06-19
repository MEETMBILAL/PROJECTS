import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const prisma = getPrisma();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!prisma) {
    return NextResponse.json({ ok: true, mode: "demo" });
  }

  await prisma.bookmark.deleteMany({
    where: {
      userId: session.user.id,
      OR: [{ id: params.id }, { comicId: params.id }]
    }
  });

  return NextResponse.json({ ok: true });
}
