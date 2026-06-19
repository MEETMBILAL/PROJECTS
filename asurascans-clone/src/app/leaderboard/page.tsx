import type { Metadata } from "next";

import { LeaderboardTabs } from "@/components/leaderboard-tabs";
import { getLeaderboard } from "@/lib/data";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "The most-read comics this week, this month, and of all time.",
};

export const revalidate = 300;

export default async function LeaderboardPage() {
  const [weekly, monthly, alltime] = await Promise.all([
    getLeaderboard("weekly"),
    getLeaderboard("monthly"),
    getLeaderboard("alltime"),
  ]);

  return (
    <div className="container max-w-3xl space-y-6 py-6">
      <div>
        <h1 className="section-heading mb-1">Leaderboard</h1>
        <p className="pl-3 text-sm text-brand-text-secondary">
          The most-read series across the platform.
        </p>
      </div>
      <LeaderboardTabs weekly={weekly} monthly={monthly} alltime={alltime} />
    </div>
  );
}
