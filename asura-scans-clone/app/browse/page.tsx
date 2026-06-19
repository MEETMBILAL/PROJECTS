import { Suspense } from "react";
import { BrowseFilters } from "@/components/browse-filters";
import { InfiniteComicGrid } from "@/components/infinite-comic-grid";
import { listComics } from "@/lib/comics";
import type { ComicStatus, ComicType } from "@/types/comic";

type BrowsePageProps = {
  searchParams: {
    genre?: string | string[];
    status?: ComicStatus;
    type?: ComicType;
    sort?: "latest" | "az" | "rating" | "views";
    page?: string;
  };
};

export const metadata = {
  title: "Browse Comics"
};

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const genres = Array.isArray(searchParams.genre)
    ? searchParams.genre
    : searchParams.genre
      ? [searchParams.genre]
      : [];
  const initial = await listComics({
    genre: genres,
    status: searchParams.status,
    type: searchParams.type,
    sort: searchParams.sort ?? "latest",
    page: Number(searchParams.page ?? 1)
  });

  const params = new URLSearchParams();
  genres.forEach((genre) => params.append("genre", genre));
  if (searchParams.status) params.set("status", searchParams.status);
  if (searchParams.type) params.set("type", searchParams.type);
  if (searchParams.sort) params.set("sort", searchParams.sort);

  return (
    <div className="container-shell py-8 md:py-10">
      <div className="mb-6">
        <h1 className="section-heading">Browse Comics</h1>
        <p className="mt-3 max-w-2xl text-sm text-brand-textSecondary">
          Filter by genre, publication status, comic type, and sort order. Results are optimized for infinite browsing.
        </p>
      </div>
      <div className="space-y-8">
        <Suspense fallback={null}>
          <BrowseFilters />
        </Suspense>
        <InfiniteComicGrid initial={initial} queryString={params.toString()} />
      </div>
    </div>
  );
}
