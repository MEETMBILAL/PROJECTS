import { Suspense } from "react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { TrendingRow } from "@/components/home/TrendingRow";
import { ComicGrid } from "@/components/comics/ComicGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LatestUpdatesGrid } from "@/components/home/LatestUpdatesGrid";
import { HomeSkeleton } from "@/components/home/HomeSkeleton";
import {
  getFeaturedComics,
  getTrendingComics,
  getLatestComics,
  getNewComics,
  getCompletedComics,
} from "@/lib/comics";

export const dynamic = "force-dynamic";

async function HomeContent() {
  const [featured, trending, latest, newTitles, completed] = await Promise.all([
    getFeaturedComics(),
    getTrendingComics(),
    getLatestComics(24),
    getNewComics(12),
    getCompletedComics(12),
  ]);

  return (
    <>
      <HeroBanner comics={featured} />

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 lg:px-6">
        <section aria-labelledby="trending-heading">
          <SectionHeading title="Trending Today" />
          <TrendingRow comics={trending} />
        </section>

        <section aria-labelledby="latest-heading">
          <SectionHeading title="Latest Updates" />
          <LatestUpdatesGrid comics={latest} />
        </section>

        <section aria-labelledby="new-heading">
          <SectionHeading title="New Titles" />
          <ComicGrid initialComics={newTitles} badge="NEW" />
        </section>

        <section aria-labelledby="completed-heading">
          <SectionHeading title="Completed Series" />
          <ComicGrid initialComics={completed} badge="END" />
        </section>
      </div>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
