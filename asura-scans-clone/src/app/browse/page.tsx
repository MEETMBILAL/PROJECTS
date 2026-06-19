import { Suspense } from "react";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { FilterBar } from "@/components/browse/filter-bar";
import { InfiniteComicGrid } from "@/components/browse/infinite-comic-grid";
import { ComicGridSkeleton } from "@/components/comics/comic-grid";
import { BookmarkHydrator } from "@/components/comics/bookmark-hydrator";
import { getComics } from "@/lib/queries";
import { getUserBookmarkIds } from "@/lib/bookmarks";
import { PAGE_SIZE, type SortOption } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse",
  description: "Browse and filter the full catalog of manga, manhwa and manhua.",
};

interface BrowsePageProps {
  searchParams: {
    genre?: string;
    status?: string;
    type?: string;
    sort?: string;
    q?: string;
  };
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const genres = (searchParams.genre ?? "")
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);

  const [initial, bookmarkIds] = await Promise.all([
    getComics({
      genres,
      status: searchParams.status,
      type: searchParams.type,
      sort: (searchParams.sort as SortOption) ?? "latest",
      search: searchParams.q,
      page: 1,
      pageSize: PAGE_SIZE,
    }),
    getUserBookmarkIds(),
  ]);

  return (
    <div className="container py-8">
      <BookmarkHydrator ids={bookmarkIds} />
      <SectionHeading title="Browse Comics" />
      <div className="mb-6">
        <Suspense fallback={<div className="h-10" />}>
          <FilterBar />
        </Suspense>
      </div>

      <Suspense fallback={<ComicGridSkeleton count={PAGE_SIZE} />}>
        <InfiniteComicGrid initial={initial} />
      </Suspense>
    </div>
  );
}
