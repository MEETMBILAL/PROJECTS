import Link from "next/link";

import { ComicCard } from "@/components/comics/comic-card";
import { HeroSlider } from "@/components/comics/hero-slider";
import { UpdateCard } from "@/components/comics/update-card";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { completedComics, featuredComics, latestComics, newComics, trendingComics } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <div>
      <HeroSlider comics={featuredComics} />
      <div className="asura-container space-y-12 py-10">
        <section>
          <SectionHeading title="Trending Today" action={<Button asChild variant="ghost" className="text-brand-light hover:text-white"><Link href="/leaderboard">View ranks</Link></Button>} />
          <div className="flex snap-x gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible lg:grid-cols-10">
            {trendingComics.map((comic, index) => (
              <div key={comic.id} className="min-w-[150px] snap-start md:min-w-0">
                <ComicCard comic={comic} rank={index + 1} badge={index < 3 ? "HOT" : undefined} compact />
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading title="Latest Updates" action={<Button asChild variant="ghost" className="text-brand-light hover:text-white"><Link href="/browse?sort=latest">Browse all</Link></Button>} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {latestComics.slice(0, 18).map((comic) => <UpdateCard key={comic.id} comic={comic} />)}
          </div>
        </section>

        <section>
          <SectionHeading title="New Titles" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {newComics.map((comic) => <UpdateCard key={comic.id} comic={comic} badge="NEW" />)}
          </div>
        </section>

        <section>
          <SectionHeading title="Completed Series" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {completedComics.map((comic) => <UpdateCard key={comic.id} comic={comic} badge="END" />)}
          </div>
        </section>
      </div>
    </div>
  );
}
