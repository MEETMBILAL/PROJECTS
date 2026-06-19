import { Suspense } from "react";

import { SearchPageClient } from "@/components/search-page-client";
import { SectionTitle } from "@/components/section-title";

export const metadata = {
  title: "Search",
};

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  return (
    <div className="container-shell max-w-4xl space-y-6 py-10">
      <SectionTitle title="Search" />
      <Suspense fallback={<div className="h-40 rounded-xl bg-brand-card" />}>
        <SearchPageClient initialQuery={searchParams.q ?? ""} />
      </Suspense>
    </div>
  );
}
