export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { LeaderboardContent } from "@/components/leaderboard/LeaderboardContent";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Leaderboard" };

interface LeaderboardPageProps {
  searchParams: { period?: string };
}

export default function LeaderboardPage({ searchParams }: LeaderboardPageProps) {
  const period = (searchParams.period as "weekly" | "monthly" | "alltime") ?? "weekly";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <SectionHeading title="Leaderboard" />
      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardContent period={period} />
      </Suspense>
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  );
}
