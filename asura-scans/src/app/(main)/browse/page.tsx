import { Suspense } from "react";
import { ComicFiltersBar } from "@/components/comics/ComicFilters";
import { InfiniteComicGrid } from "@/components/comics/InfiniteComicGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllGenres } from "@/lib/comics";

export const metadata = {
  title: "Browse",
};

export const dynamic = "force-dynamic";

export default async function BrowsePage() {
  let genres: Awaited<ReturnType<typeof getAllGenres>> = [];
  try {
    genres = await getAllGenres();
  } catch {
    // DB not connected
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="section-heading text-2xl mb-6">Browse Comics</h1>
      <ComicFiltersBar genres={genres} />
      <div className="mt-6">
        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-cover" />
              ))}
            </div>
          }
        >
          <InfiniteComicGrid />
        </Suspense>
      </div>
    </div>
  );
}
