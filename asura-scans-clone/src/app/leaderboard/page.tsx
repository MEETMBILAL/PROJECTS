import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { LeaderboardList } from "@/components/leaderboard/leaderboard-list";
import { getLeaderboard } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "The most-read manga, manhwa and manhua this week, month and all-time.",
};

export default async function LeaderboardPage() {
  const initial = await getLeaderboard("weekly", 30);

  return (
    <div className="container py-8">
      <SectionHeading title="Leaderboard" />
      <p className="mb-6 -mt-2 text-sm text-brand-text-secondary">
        The most-read series ranked by views.
      </p>
      <LeaderboardList initial={initial} initialPeriod="weekly" />
    </div>
  );
}
