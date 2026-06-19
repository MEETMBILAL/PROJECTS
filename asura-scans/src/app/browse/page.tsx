export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { BrowseFiltersBar } from "@/components/browse/BrowseFilters";
import { ComicGrid, ComicGridSkeleton } from "@/components/browse/ComicGrid";
import { browseComics, getAllGenres } from "@/lib/comics";
import { ComicStatus, ComicType } from "@prisma/client";

export const metadata = {
  title: "Browse",
};

interface BrowsePageProps {
  searchParams: {
    genres?: string;
    status?: string;
    type?: string;
    sort?: string;
    page?: string;
  };
}

async function BrowseContent({ searchParams }: BrowsePageProps) {
  const genres = await getAllGenres();
  const filters = {
    genres: searchParams.genres?.split(",").filter(Boolean),
    status: searchParams.status?.split(",").filter(Boolean) as ComicStatus[] | undefined,
    type: searchParams.type?.split(",").filter(Boolean) as ComicType[] | undefined,
    sort: (searchParams.sort ?? "latest") as "latest" | "az" | "rating" | "views",
    page: 1,
    limit: 24,
  };

  const result = await browseComics(filters);

  const filterParams: Record<string, string> = {};
  if (searchParams.genres) filterParams.genres = searchParams.genres;
  if (searchParams.status) filterParams.status = searchParams.status;
  if (searchParams.type) filterParams.type = searchParams.type;
  if (searchParams.sort) filterParams.sort = searchParams.sort;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="section-heading text-2xl mb-6">Browse Comics</h1>
      <Suspense fallback={<div className="h-32 animate-pulse bg-brand-card rounded-cover" />}>
        <BrowseFiltersBar genres={genres} />
      </Suspense>
      <div className="mt-8">
        <ComicGrid
          initialComics={result.data}
          initialHasMore={result.hasMore}
          filters={filterParams}
        />
      </div>
    </div>
  );
}

export default function BrowsePage({ searchParams }: BrowsePageProps) {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <ComicGridSkeleton />
      </div>
    }>
      <BrowseContent searchParams={searchParams} />
    </Suspense>
  );
}
