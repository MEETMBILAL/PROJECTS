import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";

const bookmarkSchema = z.object({
  comicId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = bookmarkSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid bookmark payload" }, { status: 400 });
  }

  return NextResponse.json({
    bookmark: {
      id: `${session.user.id}:${body.data.comicId}`,
      comicId: body.data.comicId,
      userId: session.user.id,
    },
  });
}
