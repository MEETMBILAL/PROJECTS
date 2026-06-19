export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { incrementComicView } from "@/lib/comics";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { comicId, chapterId } = await request.json();

    if (!comicId) {
      return NextResponse.json({ error: "comicId is required" }, { status: 400 });
    }

    await incrementComicView(comicId, chapterId, session?.user?.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/views error:", error);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}
