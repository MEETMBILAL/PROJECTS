import { Suspense } from "react";
import type { Metadata } from "next";
import { FilterBar } from "@/components/browse/filter-bar";
import { InfiniteGrid } from "@/components/comic/infinite-grid";
import { ComicGridSkeleton } from "@/components/comic/comic-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllGenres } from "@/lib/comics";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse",
  description: "Browse the full library of manga, manhwa and manhua with powerful filters.",
};

function buildQueryString(searchParams: Record<string, string | string[] | undefined>): string {
  const params = new URLSearchParams();
  for (const key of ["genres", "status", "type", "sort", "q"]) {
    const v = searchParams[key];
    if (typeof v === "string" && v) params.set(key, v);
  }
  return params.toString();
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const genres = await getAllGenres().catch(() => []);
  const queryString = buildQueryString(searchParams);

  return (
    <div className="container space-y-6 py-6">
      <header>
        <h1 className="border-l-[3px] border-brand-purple pl-3 text-2xl font-bold text-white">
          Browse Library
        </h1>
        <p className="mt-2 pl-3 text-sm text-brand-text-secondary">
          Filter by genre, status and type. Sort to find your next read.
        </p>
      </header>

      <Suspense fallback={<Skeleton className="h-10 w-full max-w-2xl" />}>
        <FilterBar genres={genres} />
      </Suspense>

      <Suspense fallback={<ComicGridSkeleton count={12} />}>
        <InfiniteGrid key={queryString} queryString={queryString} />
      </Suspense>
    </div>
  );
}
