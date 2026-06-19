export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { SearchResults } from "@/components/search/SearchResults";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Search" };

interface SearchPageProps {
  searchParams: { q?: string };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q ?? "";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <SectionHeading title={query ? `Results for "${query}"` : "Search"} />
      <Suspense fallback={<SearchSkeleton />}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-lg" />
      ))}
    </div>
  );
}
