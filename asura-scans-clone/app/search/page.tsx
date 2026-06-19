import { SearchPageClient } from "@/components/search-page-client";

type SearchPageProps = {
  searchParams: {
    q?: string;
  };
};

export const metadata = {
  title: "Search"
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="container-shell py-10">
      <div className="mb-6">
        <h1 className="section-heading">Search</h1>
        <p className="mt-3 text-sm text-brand-textSecondary">Instant results update as you type.</p>
      </div>
      <SearchPageClient initialQuery={searchParams.q ?? ""} />
    </div>
  );
}
