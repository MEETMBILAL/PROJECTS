import { Suspense } from "react";

import { BrowseFilters } from "@/components/comics/browse-filters";
import { InfiniteComicGrid } from "@/components/comics/comic-grid";
import { SectionHeading } from "@/components/common/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { browseComics } from "@/lib/mock-data";
import { parseCsvParam } from "@/lib/api-utils";
import type { BrowseFilters as BrowseFilterType } from "@/lib/types";

export const metadata = { title: "Browse" };

type Props = {
  searchParams: {
    genres?: string;
    status?: BrowseFilterType["status"];
    type?: BrowseFilterType["type"];
    sort?: BrowseFilterType["sort"];
  };
};

export default function BrowsePage({ searchParams }: Props) {
  const filters: BrowseFilterType = {
    genres: parseCsvParam(searchParams.genres ?? null),
    status: searchParams.status ?? "ALL",
    type: searchParams.type ?? "ALL",
    sort: searchParams.sort ?? "latest",
  };
  const results = browseComics(filters);

  return (
    <div className="asura-container py-10">
      <SectionHeading title="Browse Comics" />
      <Suspense fallback={<Skeleton className="mb-8 h-40 rounded-xl bg-brand-card" />}>
        <BrowseFilters />
      </Suspense>
      {results.length ? <InfiniteComicGrid comics={results} /> : (
        <div className="rounded-xl border border-brand-surface bg-brand-card p-10 text-center">
          <h2 className="text-xl font-bold text-white">No comics found</h2>
          <p className="mt-2 text-brand-secondary">Try removing a filter or selecting another genre.</p>
        </div>
      )}
    </div>
  );
}
