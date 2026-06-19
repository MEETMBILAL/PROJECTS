import type { Metadata } from "next";
import { Suspense } from "react";

import { ComicGrid } from "@/components/comic-grid";
import { FilterBar } from "@/components/filter-bar";
import { getAllGenres, getComics } from "@/lib/data";
import { parseFilters } from "@/lib/parse-filters";

export const metadata: Metadata = {
  title: "Browse",
  description: "Browse the full library of manga, manhwa and manhua.",
};

export const dynamic = "force-dynamic";

function toSearchParams(sp: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value)) params.set(key, value.join(","));
  }
  return params;
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const params = toSearchParams(searchParams);
  const filters = parseFilters(params);
  const [initial, genres] = await Promise.all([
    getComics(filters),
    getAllGenres(),
  ]);

  // Build the query string used by ComicGrid to load more pages.
  const gridParams = new URLSearchParams(params);
  gridParams.delete("page");

  return (
    <div className="container max-w-screen-2xl space-y-6 py-6">
      <div>
        <h1 className="section-heading mb-1">Browse Library</h1>
        <p className="pl-3 text-sm text-brand-text-secondary">
          {initial.total.toLocaleString()} titles
        </p>
      </div>

      <Suspense fallback={<div className="h-16" />}>
        <FilterBar genres={genres} />
      </Suspense>

      <ComicGrid
        key={gridParams.toString()}
        initial={initial}
        queryString={gridParams.toString()}
      />
    </div>
  );
}
