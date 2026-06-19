import { SectionHeading } from "@/components/common/section-heading";
import { SearchClient } from "@/app/search/search-client";

export const metadata = { title: "Search" };

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  return (
    <div className="asura-container py-10">
      <SectionHeading title="Search" />
      <SearchClient initialQuery={searchParams.q ?? ""} />
    </div>
  );
}
