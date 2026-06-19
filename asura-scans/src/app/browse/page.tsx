import type { Metadata } from "next";
import { FilterBar } from "@/components/browse/filter-bar";
import { ComicGrid } from "@/components/comic/comic-grid";
import { getComics, getGenres } from "@/lib/data";
import type { ComicFilters, ComicStatus, ComicType } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse",
  description: "Browse the full library of manhwa, manga and manhua by genre, status and type.",
};

interface BrowsePageProps {
  searchParams: {
    genres?: string;
    status?: string;
    type?: string;
    sort?: string;
    q?: string;
  };
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const filters: ComicFilters = {
    genres: searchParams.genres?.split(",").filter(Boolean),
    status: (searchParams.status as ComicStatus) || undefined,
    type: (searchParams.type as ComicType) || undefined,
    sort: (searchParams.sort as ComicFilters["sort"]) || "latest",
    search: searchParams.q || undefined,
    page: 1,
  };

  const [genres, result] = await Promise.all([getGenres(), getComics(filters)]);

  return (
    <div className="container space-y-6 py-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Browse Library</h1>
          <p className="mt-1 text-sm text-brand-text-secondary">
            {result.total.toLocaleString()} titles available
          </p>
        </div>
      </div>

      <FilterBar genres={genres} />

      <ComicGrid
        key={JSON.stringify(filters)}
        initialComics={result.comics}
        initialHasMore={result.hasMore}
        filters={filters}
        loadMode="scroll"
      />
    </div>
  );
}
