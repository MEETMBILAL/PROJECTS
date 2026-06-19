import { NextResponse } from "next/server";

import { comics } from "@/lib/mock-data";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const chapter = comics.flatMap((comic) => comic.chapters).find((item) => item.id === params.id);
  if (!chapter) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  return NextResponse.json({ pages: chapter.pages });
}
