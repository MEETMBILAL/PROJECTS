import { ComicCard } from "@/components/comic-card";
import { ComicGrid } from "@/components/comic-grid";
import { HeroCarousel } from "@/components/hero-carousel";
import { Section } from "@/components/section";
import { getCompletedComics, getLatestComics, getNewComics, getTrendingComics } from "@/lib/comics";

export default async function HomePage() {
  const [trending, latest, newest, completed] = await Promise.all([
    getTrendingComics(),
    getLatestComics(18),
    getNewComics(12),
    getCompletedComics(12)
  ]);

  return (
    <>
      <HeroCarousel comics={trending} />

      <Section title="Trending Today" href="/browse?sort=views">
        <div className="flex gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-5 md:overflow-visible">
          {trending.map((comic, index) => (
            <div key={comic.id} className="w-[160px] flex-none md:w-auto">
              <ComicCard comic={comic} rank={index + 1} badge={index < 3 ? "HOT" : undefined} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Latest Updates" href="/browse?sort=latest">
        <ComicGrid comics={latest} variant="update" />
      </Section>

      <Section title="New Titles" href="/browse?sort=latest">
        <ComicGrid comics={newest} badge="NEW" />
      </Section>

      <Section title="Completed Series" href="/browse?status=COMPLETED">
        <ComicGrid comics={completed} badge="END" />
      </Section>
    </>
  );
}
