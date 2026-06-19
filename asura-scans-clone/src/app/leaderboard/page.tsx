import type { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaderboardList } from "@/components/leaderboard/leaderboard-list";
import { getLeaderboard } from "@/lib/comics";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "The most-read comics this week, month and of all time.",
};

export default async function LeaderboardPage() {
  const [weekly, monthly, all] = await Promise.all([
    getLeaderboard("weekly", 20).catch(() => []),
    getLeaderboard("monthly", 20).catch(() => []),
    getLeaderboard("all", 20).catch(() => []),
  ]);

  return (
    <div className="container space-y-6 py-6">
      <header>
        <h1 className="border-l-[3px] border-brand-purple pl-3 text-2xl font-bold text-white">
          Leaderboard
        </h1>
        <p className="mt-2 pl-3 text-sm text-brand-text-secondary">
          The most-read titles across the platform.
        </p>
      </header>

      <Tabs defaultValue="weekly">
        <TabsList>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="all">All-time</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly">
          <LeaderboardList comics={weekly} />
        </TabsContent>
        <TabsContent value="monthly">
          <LeaderboardList comics={monthly} />
        </TabsContent>
        <TabsContent value="all">
          <LeaderboardList comics={all} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
