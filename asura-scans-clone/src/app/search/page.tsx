import { Suspense } from "react";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { SearchResults } from "@/components/search/search-results";
import { searchComics } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q ?? "";
  const results = query.trim().length >= 2 ? await searchComics(query, 30) : [];

  return (
    <div className="container py-8">
      <SectionHeading title="Search" />
      <Suspense fallback={<div className="h-12" />}>
        <SearchResults initialQuery={query} initialResults={results} />
      </Suspense>
    </div>
  );
}
