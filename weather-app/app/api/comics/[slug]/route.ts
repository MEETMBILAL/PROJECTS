import { NextResponse } from "next/server";

import { getComicBySlug } from "@/lib/mock-data";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const comic = getComicBySlug(params.slug);
  if (!comic) {
    return NextResponse.json({ error: "Comic not found" }, { status: 404 });
  }

  return NextResponse.json({ comic });
}
