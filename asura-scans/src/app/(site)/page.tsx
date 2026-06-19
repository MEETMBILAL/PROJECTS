import { HeroBanner } from "@/components/hero-banner";
import { SectionHeading } from "@/components/section-heading";
import { TrendingCard } from "@/components/trending-card";
import { LatestUpdateCard } from "@/components/latest-update-card";
import { ComicCard } from "@/components/comic-card";
import {
  getFeaturedComics,
  getTrendingComics,
  getLatestUpdates,
  getNewTitles,
  getComicsByStatus,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, trending, latest, newTitles, completed] = await Promise.all([
    getFeaturedComics(),
    getTrendingComics(),
    getLatestUpdates(24),
    getNewTitles(12),
    getComicsByStatus("COMPLETED", 12),
  ]);

  return (
    <>
      <HeroBanner comics={featured} />

      <div className="container mx-auto px-4 py-10 space-y-12">
        <section aria-labelledby="trending-heading">
          <SectionHeading id="trending-heading">Trending Today</SectionHeading>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-5 md:overflow-visible">
            {trending.map((comic) => (
              <TrendingCard key={comic.id} comic={comic} />
            ))}
          </div>
        </section>

        <section aria-labelledby="latest-heading">
          <SectionHeading id="latest-heading">Latest Updates</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {latest.map((comic) => (
              <LatestUpdateCard key={comic.id} comic={comic} />
            ))}
          </div>
        </section>

        <section aria-labelledby="new-heading">
          <SectionHeading id="new-heading">New Titles</SectionHeading>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
            {newTitles.map((comic) => (
              <ComicCard key={comic.id} comic={comic} badge="NEW" />
            ))}
          </div>
        </section>

        <section aria-labelledby="completed-heading">
          <SectionHeading id="completed-heading">Completed Series</SectionHeading>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
            {completed.map((comic) => (
              <ComicCard key={comic.id} comic={comic} badge="END" />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
