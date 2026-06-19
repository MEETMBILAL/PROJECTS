import { NextResponse } from "next/server";
import { getComicDetail } from "@/lib/comics";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const comic = await getComicDetail(params.slug);

  if (!comic) {
    return NextResponse.json({ error: "Comic not found" }, { status: 404 });
  }

  return NextResponse.json(comic);
}
