import { Suspense } from "react";
import { SectionHeading } from "@/components/section-heading";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { TrendingRow } from "@/components/home/trending-row";
import { ComicGrid, ComicGridSkeleton } from "@/components/comics/comic-grid";
import { BookmarkHydrator } from "@/components/comics/bookmark-hydrator";
import {
  getFeatured,
  getTrending,
  getLatestUpdates,
  getNewTitles,
  getCompleted,
} from "@/lib/queries";
import { getUserBookmarkIds } from "@/lib/bookmarks";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, trending, latest, newTitles, completed, bookmarkIds] =
    await Promise.all([
      getFeatured(5),
      getTrending(10),
      getLatestUpdates(18),
      getNewTitles(12),
      getCompleted(12),
      getUserBookmarkIds(),
    ]);

  return (
    <>
      <BookmarkHydrator ids={bookmarkIds} />
      <HeroCarousel comics={featured} />

      <div className="container space-y-12 py-10">
        <section>
          <SectionHeading title="Trending Today" href="/browse?sort=views" />
          <TrendingRow comics={trending} />
        </section>

        <section>
          <SectionHeading title="Latest Updates" href="/browse?sort=latest" />
          <Suspense fallback={<ComicGridSkeleton count={18} showChapters />}>
            <ComicGrid comics={latest} showChapters />
          </Suspense>
        </section>

        {newTitles.length > 0 && (
          <section>
            <SectionHeading title="New Titles" href="/browse?sort=latest" />
            <ComicGrid comics={newTitles} />
          </section>
        )}

        {completed.length > 0 && (
          <section>
            <SectionHeading
              title="Completed Series"
              href="/browse?status=COMPLETED"
            />
            <ComicGrid comics={completed} />
          </section>
        )}
      </div>
    </>
  );
}
