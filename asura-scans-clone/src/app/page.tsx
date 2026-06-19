import { Suspense } from "react";
import { HeroSlider } from "@/components/comic/hero-slider";
import { ComicRow } from "@/components/comic/comic-row";
import { ComicGrid, ComicGridSkeleton } from "@/components/comic/comic-grid";
import { SectionHeading } from "@/components/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getFeatured,
  getTrending,
  getLatestUpdates,
  getNewTitles,
  getCompleted,
} from "@/lib/comics";

export const dynamic = "force-dynamic";

async function safe<T>(p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p;
  } catch {
    return fallback;
  }
}

async function HeroSection() {
  const featured = await safe(getFeatured(6), []);
  if (featured.length === 0) return null;
  return <HeroSlider comics={featured} />;
}

async function TrendingSection() {
  const trending = await safe(getTrending(10), []);
  if (trending.length === 0) return null;
  return (
    <section>
      <SectionHeading title="Trending Today" href="/leaderboard" />
      <ComicRow comics={trending} withRank />
    </section>
  );
}

async function LatestSection() {
  const latest = await safe(getLatestUpdates(18), []);
  if (latest.length === 0) return null;
  return (
    <section>
      <SectionHeading title="Latest Updates" href="/browse?sort=latest" />
      <ComicGrid comics={latest} showChapters />
    </section>
  );
}

async function NewSection() {
  const news = await safe(getNewTitles(12), []);
  if (news.length === 0) return null;
  return (
    <section>
      <SectionHeading title="New Titles" href="/browse?sort=latest" />
      <ComicGrid comics={news} badge="new" />
    </section>
  );
}

async function CompletedSection() {
  const completed = await safe(getCompleted(12), []);
  if (completed.length === 0) return null;
  return (
    <section>
      <SectionHeading title="Completed Series" href="/browse?status=COMPLETED" />
      <ComicGrid comics={completed} badge="end" />
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="container space-y-10 py-6">
      <Suspense fallback={<Skeleton className="h-[340px] w-full rounded-lg sm:h-[420px] md:h-[460px]" />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <TrendingSection />
      </Suspense>

      <Suspense fallback={<SectionFallback withChapters />}>
        <LatestSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <NewSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <CompletedSection />
      </Suspense>
    </div>
  );
}

function SectionFallback({ withChapters }: { withChapters?: boolean }) {
  return (
    <div>
      <Skeleton className="mb-4 h-7 w-48" />
      <ComicGridSkeleton count={6} showChapters={withChapters} />
    </div>
  );
}
