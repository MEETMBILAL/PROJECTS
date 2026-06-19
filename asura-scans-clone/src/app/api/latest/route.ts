import { NextResponse } from "next/server";
import { getLatestUpdates } from "@/lib/comics";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") ?? "18");
  try {
    const items = await getLatestUpdates(limit);
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
