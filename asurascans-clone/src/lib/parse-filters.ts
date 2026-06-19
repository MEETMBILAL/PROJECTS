import type { ComicFilters, ComicSort, ComicStatus, ComicType } from "./types";

const VALID_SORTS: ComicSort[] = ["latest", "az", "rating", "views"];
const VALID_STATUS: (ComicStatus | "ALL")[] = [
  "ALL",
  "ONGOING",
  "COMPLETED",
  "HIATUS",
];
const VALID_TYPES: (ComicType | "ALL")[] = ["ALL", "MANGA", "MANHWA", "MANHUA"];

export function parseFilters(searchParams: URLSearchParams): ComicFilters {
  const genresParam = searchParams.get("genres");
  const genres = genresParam
    ? genresParam.split(",").map((g) => g.trim()).filter(Boolean)
    : undefined;

  const sortParam = searchParams.get("sort") as ComicSort | null;
  const statusParam = searchParams.get("status") as ComicStatus | "ALL" | null;
  const typeParam = searchParams.get("type") as ComicType | "ALL" | null;

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const perPage = Math.min(
    60,
    Math.max(1, Number(searchParams.get("perPage")) || 24)
  );

  return {
    genres,
    query: searchParams.get("q") ?? undefined,
    sort: sortParam && VALID_SORTS.includes(sortParam) ? sortParam : "latest",
    status:
      statusParam && VALID_STATUS.includes(statusParam) ? statusParam : "ALL",
    type: typeParam && VALID_TYPES.includes(typeParam) ? typeParam : "ALL",
    page,
    perPage,
  };
}
