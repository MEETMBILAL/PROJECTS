import { Suspense } from "react";
import { HeroSlider } from "@/components/home/hero-slider";
import { ComicRail } from "@/components/comic/comic-rail";
import { ComicCard, ComicCardSkeleton } from "@/components/comic/comic-card";
import { SectionHeading } from "@/components/comic/section-heading";
import {
  getFeatured,
  getTrending,
  getLatest,
  getNewTitles,
  getCompleted,
} from "@/lib/data";

export const dynamic = "force-dynamic";

async function HeroSection() {
  const featured = await getFeatured(5);
  return <HeroSlider comics={featured} />;
}

async function TrendingSection() {
  const trending = await getTrending(10);
  return <ComicRail comics={trending} ranked />;
}

async function LatestSection() {
  const latest = await getLatest(18);
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
      {latest.map((comic) => (
        <ComicCard key={comic.id} comic={comic} showChapters />
      ))}
    </div>
  );
}

async function NewTitlesSection() {
  const titles = await getNewTitles(12);
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
      {titles.map((comic) => (
        <ComicCard key={comic.id} comic={comic} />
      ))}
    </div>
  );
}

async function CompletedSection() {
  const completed = await getCompleted(12);
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
      {completed.map((comic) => (
        <ComicCard key={comic.id} comic={comic} />
      ))}
    </div>
  );
}

function RailSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="w-[40vw] shrink-0 sm:w-[26vw] md:w-[20vw] lg:w-[15.5%] xl:w-[12.5%]">
          <ComicCardSkeleton />
        </div>
      ))}
    </div>
  );
}

function GridSkeleton({ showChapters = false }: { showChapters?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <ComicCardSkeleton key={i} showChapters={showChapters} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<div className="skeleton h-[420px] w-full sm:h-[480px] md:h-[540px]" />}>
        <HeroSection />
      </Suspense>

      <div className="container space-y-12 py-10">
        <section className="space-y-4">
          <SectionHeading title="Trending Today" href="/browse?sort=views" />
          <Suspense fallback={<RailSkeleton />}>
            <TrendingSection />
          </Suspense>
        </section>

        <section className="space-y-4">
          <SectionHeading title="Latest Updates" href="/browse?sort=latest" />
          <Suspense fallback={<GridSkeleton showChapters />}>
            <LatestSection />
          </Suspense>
        </section>

        <section className="space-y-4">
          <SectionHeading title="New Titles" href="/browse" />
          <Suspense fallback={<GridSkeleton />}>
            <NewTitlesSection />
          </Suspense>
        </section>

        <section className="space-y-4">
          <SectionHeading title="Completed Series" href="/browse?status=COMPLETED" />
          <Suspense fallback={<GridSkeleton />}>
            <CompletedSection />
          </Suspense>
        </section>
      </div>
    </>
  );
}
