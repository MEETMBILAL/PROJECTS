import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "@/components/search/search-results";
import { ComicGridSkeleton } from "@/components/comic/comic-grid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q ?? "";
  return (
    <div className="container space-y-6 py-6">
      <h1 className="border-l-[3px] border-brand-purple pl-3 text-2xl font-bold text-white">
        Search
      </h1>
      <Suspense fallback={<ComicGridSkeleton count={12} />}>
        <SearchResults initialQuery={q} />
      </Suspense>
    </div>
  );
}
