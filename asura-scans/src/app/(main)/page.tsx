import { HeroBanner } from "@/components/comics/HeroBanner";
import { TrendingCard } from "@/components/comics/TrendingCard";
import { LatestUpdateCard } from "@/components/comics/LatestUpdateCard";
import { ComicGrid } from "@/components/comics/ComicGrid";
import {
  getTrendingComics,
  getLatestUpdates,
  getFeaturedComics,
  getNewTitles,
  getComicsByStatus,
} from "@/lib/comics";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featured: Awaited<ReturnType<typeof getFeaturedComics>> = [];
  let trending: Awaited<ReturnType<typeof getTrendingComics>> = [];
  let latest: Awaited<ReturnType<typeof getLatestUpdates>> = [];
  let newTitles: Awaited<ReturnType<typeof getNewTitles>> = [];
  let completed: Awaited<ReturnType<typeof getComicsByStatus>> = [];

  try {
    [featured, trending, latest, newTitles, completed] = await Promise.all([
      getFeaturedComics(),
      getTrendingComics(),
      getLatestUpdates(),
      getNewTitles(),
      getComicsByStatus("COMPLETED"),
    ]);
  } catch {
    // Database not connected — show empty state
  }

  return (
    <div>
      {featured.length > 0 && <HeroBanner comics={featured} />}

      <div className="container mx-auto px-4 py-8 space-y-12">
        {trending.length > 0 && (
          <section aria-labelledby="trending-heading">
            <h2 id="trending-heading" className="section-heading">
              Trending Today
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible">
              {trending.map((comic, i) => (
                <TrendingCard key={comic.id} comic={comic} rank={i + 1} />
              ))}
            </div>
          </section>
        )}

        {latest.length > 0 && (
          <section aria-labelledby="latest-heading">
            <h2 id="latest-heading" className="section-heading">
              Latest Updates
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {latest.map((comic) => (
                <LatestUpdateCard key={comic.id} comic={comic} />
              ))}
            </div>
          </section>
        )}

        {newTitles.length > 0 && (
          <section aria-labelledby="new-heading">
            <h2 id="new-heading" className="section-heading">
              New Titles
            </h2>
            <ComicGrid comics={newTitles} badge="NEW" />
          </section>
        )}

        {completed.length > 0 && (
          <section aria-labelledby="completed-heading">
            <h2 id="completed-heading" className="section-heading">
              Completed Series
            </h2>
            <ComicGrid comics={completed} badge="END" />
          </section>
        )}

        {featured.length === 0 && trending.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to Asura Scans</h2>
            <p className="text-brand-text-secondary mb-6">
              Set up your database and run the seed script to populate comics.
            </p>
            <code className="text-sm bg-brand-card px-4 py-2 rounded-lg text-brand-purple">
              npm run db:seed
            </code>
          </div>
        )}
      </div>
    </div>
  );
}
