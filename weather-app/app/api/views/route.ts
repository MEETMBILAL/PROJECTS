import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getComicBySlug } from "@/lib/mock-data";

const viewSchema = z.object({
  comicSlug: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const body = viewSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid view payload" }, { status: 400 });
  }

  const comic = getComicBySlug(body.data.comicSlug);
  if (!comic) {
    return NextResponse.json({ error: "Comic not found" }, { status: 404 });
  }

  return NextResponse.json({ totalViews: comic.totalViews + 1 });
}
