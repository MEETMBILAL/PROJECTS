import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getComicBySlug } from "@/lib/mock-data";

const ratingSchema = z.object({
  comicSlug: z.string().min(1),
  value: z.number().int().min(1).max(10),
});

export async function POST(request: NextRequest) {
  const body = ratingSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid rating payload" }, { status: 400 });
  }

  const comic = getComicBySlug(body.data.comicSlug);
  if (!comic) {
    return NextResponse.json({ error: "Comic not found" }, { status: 404 });
  }

  const ratingCount = comic.ratingCount + 1;
  const avgRating = Number(((comic.avgRating * comic.ratingCount + body.data.value) / ratingCount).toFixed(1));
  return NextResponse.json({ avgRating, ratingCount });
}
