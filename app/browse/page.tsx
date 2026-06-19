import { FilterBar } from '@/components/comics/filter-bar';
import { InfiniteComicGrid } from '@/components/comics/infinite-comic-grid';
import { getComics } from '@/lib/data';
import type { ComicStatus, ComicType } from '@/lib/types';

export default async function BrowsePage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const genre = typeof searchParams.genre === 'string' ? searchParams.genre : undefined;
  const status = typeof searchParams.status === 'string' ? (searchParams.status as ComicStatus) : undefined;
  const type = typeof searchParams.type === 'string' ? (searchParams.type as ComicType) : undefined;
  const sort = typeof searchParams.sort === 'string' ? (searchParams.sort as 'latest' | 'az' | 'rating' | 'views') : 'latest';
  const comics = await getComics({ genres: genre ? [genre] : undefined, status, type, sort, pageSize: 50 });

  return (
    <main className="pt-[60px]">
      <div className="border-b border-brand-surface bg-brand-card/40 py-10">
        <div className="container"><h1 className="text-3xl font-black text-white md:text-5xl">Browse Comics</h1><p className="mt-3 max-w-2xl text-brand-secondary">Filter by genre, publication status, format, and popularity.</p></div>
      </div>
      <FilterBar />
      <section className="container py-8">
        <InfiniteComicGrid comics={comics.items} />
      </section>
    </main>
  );
}
