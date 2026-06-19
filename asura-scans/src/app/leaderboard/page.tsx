import type { Metadata } from "next";
import { Trophy } from "lucide-react";
import { LeaderboardTabs } from "@/components/leaderboard/leaderboard-tabs";
import { getLeaderboard } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "The most-read manhwa, manga and manhua this week, month, and of all time.",
};

export default async function LeaderboardPage() {
  const [weekly, monthly, allTime] = await Promise.all([
    getLeaderboard("WEEKLY", 20),
    getLeaderboard("MONTHLY", 20),
    getLeaderboard("ALL_TIME", 20),
  ]);

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-purple/15">
          <Trophy className="h-6 w-6 text-brand-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Leaderboard</h1>
          <p className="text-sm text-brand-text-secondary">Top titles by reader views</p>
        </div>
      </div>

      <LeaderboardTabs weekly={weekly} monthly={monthly} allTime={allTime} />
    </div>
  );
}
