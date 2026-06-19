import Link from "next/link";

import { ComicCard, UpdateComicCard } from "@/components/comic-card";
import { HeroSlider } from "@/components/hero-slider";
import { SectionTitle } from "@/components/section-title";
import { Button } from "@/components/ui/button";
import { getCompletedComics, getFeaturedComics, getLatestComics, getNewTitles, getTrendingComics } from "@/lib/mock-data";

export default function HomePage() {
  const featured = getFeaturedComics();
  const trending = getTrendingComics(10);
  const latest = getLatestComics(18);
  const newTitles = getNewTitles(12);
  const completed = getCompletedComics(12);

  return (
    <>
      <HeroSlider comics={featured} />
      <div className="container-shell space-y-12 py-10">
        <section>
          <SectionTitle title="Trending Today" action={<Button asChild variant="ghost"><Link href="/leaderboard">View rankings</Link></Button>} />
          <div className="flex snap-x gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-5 md:overflow-visible">
            {trending.map((comic, index) => (
              <div key={comic.id} className="w-40 shrink-0 snap-start md:w-auto">
                <ComicCard comic={comic} rank={index + 1} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="Latest Updates" action={<Button asChild variant="ghost"><Link href="/browse?sort=latest">Browse all</Link></Button>} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {latest.map((comic) => (
              <UpdateComicCard key={comic.id} comic={comic} />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="New Titles" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
            {newTitles.map((comic) => (
              <ComicCard key={comic.id} comic={comic} badge="NEW" />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="Completed Series" />
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
