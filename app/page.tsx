import { ComicCard } from '@/components/comics/comic-card';
import { ComicGridSection } from '@/components/comics/comic-grid-section';
import { HeroSlider } from '@/components/comics/hero-slider';
import { SectionHeading } from '@/components/comics/section-heading';
import { getComics, getLatest, getTrending } from '@/lib/data';

export default async function HomePage() {
  const [featured, trending, latest, newTitles, completed] = await Promise.all([
    getComics({ sort: 'rating', pageSize: 8 }),
    getTrending(10),
    getLatest(18),
    getComics({ sort: 'latest', pageSize: 12 }),
    getComics({ status: 'COMPLETED', sort: 'rating', pageSize: 12 }),
  ]);

  return (
    <main>
      <HeroSlider comics={featured.items.slice(0, 6)} />
      <section className="container py-8">
        <SectionHeading title="Trending Today" href="/leaderboard" />
        <div className="flex snap-x gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-5 md:overflow-visible">
          {trending.map((comic, index) => <ComicCard key={`${comic.id}-${index}`} comic={comic} rank={index + 1} className="w-44 shrink-0 snap-start md:w-auto" />)}
        </div>
      </section>
      <ComicGridSection title="Latest Updates" comics={latest} showChapters href="/browse?sort=latest" />
      <ComicGridSection title="New Titles" comics={newTitles.items} badge="NEW" href="/browse?sort=latest" />
      <ComicGridSection title="Completed Series" comics={completed.items} badge="END" href="/browse?status=COMPLETED" />
    </main>
  );
}
