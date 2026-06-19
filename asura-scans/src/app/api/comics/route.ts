import { NextResponse } from "next/server";
import { getComics } from "@/lib/comics";
import type { ComicStatus, ComicType } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const genres = searchParams.get("genres")?.split(",").filter(Boolean);
    const status = searchParams.get("status")?.split(",").filter(Boolean) as ComicStatus[] | undefined;
    const type = searchParams.get("type")?.split(",").filter(Boolean) as ComicType[] | undefined;
    const sort = (searchParams.get("sort") as "latest" | "az" | "rating" | "views") ?? "latest";
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "24");
    const search = searchParams.get("search") ?? undefined;

    const result = await getComics({ genres, status, type, sort, page, limit, search });
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/comics error:", error);
    return NextResponse.json({ error: "Failed to fetch comics" }, { status: 500 });
  }
}
