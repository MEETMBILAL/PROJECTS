import { Suspense } from "react";
import { BrowseContent } from "@/components/browse/BrowseContent";
import { BrowseSkeleton } from "@/components/browse/BrowseSkeleton";
import { getAllGenres, getComics } from "@/lib/comics";
import type { ComicStatus, ComicType } from "@prisma/client";
import type { SortOption } from "@/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Browse",
};

interface BrowsePageProps {
  searchParams: {
    genres?: string;
    status?: string;
    type?: string;
    sort?: string;
    page?: string;
  };
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const genres = await getAllGenres();

  const filters = {
    genres: searchParams.genres?.split(",").filter(Boolean),
    status: searchParams.status?.split(",").filter(Boolean) as ComicStatus[] | undefined,
    type: searchParams.type?.split(",").filter(Boolean) as ComicType[] | undefined,
    sort: (searchParams.sort as SortOption) ?? "latest",
    page: parseInt(searchParams.page ?? "1", 10),
    limit: 24,
  };

  const { comics, pagination } = await getComics(filters);

  return (
    <Suspense fallback={<BrowseSkeleton />}>
      <BrowseContent
        genres={genres}
        searchParams={searchParams}
        initialComics={comics}
        initialHasMore={pagination.hasMore}
      />
    </Suspense>
  );
}
