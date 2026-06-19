import { Suspense } from "react";

import { BrowseFilters } from "@/components/browse-filters";
import { InfiniteComicGrid } from "@/components/infinite-comic-grid";
import { SectionTitle } from "@/components/section-title";
import { allGenres, queryComics, type ComicStatus, type ComicType } from "@/lib/mock-data";

type BrowsePageProps = {
  searchParams: {
    genre?: string;
    status?: ComicStatus;
    type?: ComicType;
    sort?: "latest" | "az" | "rating" | "views";
    q?: string;
  };
};

export const metadata = {
  title: "Browse Comics",
};

export default function BrowsePage({ searchParams }: BrowsePageProps) {
  const result = queryComics({
    genres: searchParams.genre ? [searchParams.genre] : undefined,
    status: searchParams.status ?? "ALL",
    type: searchParams.type ?? "ALL",
    sort: searchParams.sort ?? "latest",
    q: searchParams.q,
    pageSize: 60,
  });

  return (
    <div className="container-shell space-y-6 py-10">
      <div>
        <SectionTitle title="Browse" className="mb-3" />
        <p className="max-w-3xl text-sm leading-6 text-brand-textSecondary">
          Filter by genre, status, title type, and popularity to discover your next long-strip binge.
        </p>
      </div>

      <Suspense fallback={<div className="h-32 rounded-xl bg-brand-card" />}>
        <BrowseFilters genres={allGenres} />
      </Suspense>

      <div className="flex items-center justify-between">
        <p className="text-sm text-brand-textSecondary">{result.total} comics found</p>
      </div>

      {result.items.length > 0 ? (
        <InfiniteComicGrid initialComics={result.items} />
      ) : (
        <div className="rounded-xl border border-brand-surface bg-brand-card p-12 text-center text-brand-textSecondary">
          No comics match those filters. Try removing a chip or choosing another genre.
        </div>
      )}
    </div>
  );
}
