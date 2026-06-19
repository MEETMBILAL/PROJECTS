import { Suspense } from "react";

import { ComicCard, ComicCardSkeleton } from "@/components/comic-card";
import { HeroSlider } from "@/components/hero-slider";
import { ScrollRow, SectionHeading } from "@/components/section-row";
import {
  getCompleted,
  getFeatured,
  getLatest,
  getNewTitles,
  getTrending,
} from "@/lib/data";

export const revalidate = 60;

async function HeroSection() {
  const featured = await getFeatured(6);
  return <HeroSlider comics={featured} />;
}

async function TrendingSection() {
  const trending = await getTrending(10);
  return (
    <section>
      <SectionHeading title="Trending Today" href="/browse?sort=views" />
      {/* Horizontal scroll on mobile, grid on desktop */}
      <ScrollRow className="lg:hidden">
        {trending.map((comic, i) => (
          <div key={comic.id} className="w-36 shrink-0 snap-start">
            <ComicCard comic={comic} rank={i + 1} priority={i < 4} />
          </div>
        ))}
      </ScrollRow>
      <div className="hidden grid-cols-5 gap-3 lg:grid">
        {trending.slice(0, 10).map((comic, i) => (
          <ComicCard key={comic.id} comic={comic} rank={i + 1} priority={i < 5} />
        ))}
      </div>
    </section>
  );
}

async function LatestSection() {
  const latest = await getLatest(18);
  return (
    <section>
      <SectionHeading title="Latest Updates" href="/browse?sort=latest" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {latest.map((comic, i) => (
          <ComicCard
            key={comic.id}
            comic={comic}
            showChapters
            priority={i < 6}
          />
        ))}
      </div>
    </section>
  );
}

async function NewTitlesSection() {
  const items = await getNewTitles(12);
  if (items.length === 0) return null;
  return (
    <section>
      <SectionHeading title="New Titles" href="/browse?sort=latest" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {items.map((comic) => (
          <ComicCard key={comic.id} comic={comic} />
        ))}
      </div>
    </section>
  );
}

async function CompletedSection() {
  const items = await getCompleted(12);
  if (items.length === 0) return null;
  return (
    <section>
      <SectionHeading title="Completed Series" href="/browse?status=COMPLETED" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {items.map((comic) => (
          <ComicCard key={comic.id} comic={comic} />
        ))}
      </div>
    </section>
  );
}

function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <ComicCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="container max-w-screen-2xl space-y-10 py-6">
      <Suspense
        fallback={
          <div className="h-[340px] w-full animate-pulse rounded-lg bg-brand-card sm:h-[420px] lg:h-[480px]" />
        }
      >
        <HeroSection />
      </Suspense>

      <Suspense fallback={<GridSkeleton count={10} />}>
        <TrendingSection />
      </Suspense>

      <Suspense fallback={<GridSkeleton count={12} />}>
        <LatestSection />
      </Suspense>

      <Suspense fallback={<GridSkeleton />}>
        <NewTitlesSection />
      </Suspense>

      <Suspense fallback={<GridSkeleton />}>
        <CompletedSection />
      </Suspense>
    </div>
  );
}
