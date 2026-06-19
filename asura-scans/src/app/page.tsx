export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { ComicCard } from "@/components/comics/ComicCard";
import { LatestUpdateCard } from "@/components/comics/LatestUpdateCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getFeaturedComics,
  getTrendingComics,
  getLatestUpdates,
  getNewTitles,
  getCompletedSeries,
} from "@/lib/comics";

async function HomeContent() {
  const [featured, trending, latest, newTitles, completed] = await Promise.all([
    getFeaturedComics(),
    getTrendingComics(),
    getLatestUpdates(24),
    getNewTitles(12),
    getCompletedSeries(12),
  ]);

  return (
    <>
      <HeroBanner comics={featured.length > 0 ? featured : trending.slice(0, 5)} />

      <div className="container mx-auto px-4 py-10 space-y-12">
        <section>
          <h2 className="section-heading">Trending Today</h2>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 md:grid md:grid-cols-5 md:overflow-visible">
            {trending.map((comic) => (
              <div key={comic.id} className="w-40 shrink-0 md:w-auto">
                <ComicCard comic={comic} variant="trending" />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-heading">Latest Updates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {latest.map((comic) => (
              <LatestUpdateCard key={comic.id} comic={comic} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-heading">New Titles</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {newTitles.map((comic) => (
              <ComicCard key={comic.id} comic={{ ...comic, isNew: true }} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-heading">Completed Series</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {completed.map((comic) => (
              <ComicCard key={comic.id} comic={comic} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function HomeSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10 space-y-12">
      <Skeleton className="h-[400px] w-full rounded-cover" />
      <div>
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="aspect-cover" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
