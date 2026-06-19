import { NextRequest, NextResponse } from "next/server";
import { browseComics } from "@/lib/comics";
import { ComicStatus, ComicType } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") ?? "1");
    const genres = searchParams.get("genres")?.split(",").filter(Boolean);
    const status = searchParams.get("status")?.split(",").filter(Boolean) as ComicStatus[] | undefined;
    const type = searchParams.get("type")?.split(",").filter(Boolean) as ComicType[] | undefined;
    const sort = (searchParams.get("sort") ?? "latest") as "latest" | "az" | "rating" | "views";

    const result = await browseComics({
      page,
      genres,
      status,
      type,
      sort,
      limit: 24,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/comics error:", error);
    return NextResponse.json({ error: "Failed to fetch comics" }, { status: 500 });
  }
}
