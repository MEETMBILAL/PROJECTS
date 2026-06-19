import { LeaderboardTabs } from "@/components/leaderboard/leaderboard-tabs";
import { SectionHeading } from "@/components/common/section-heading";
import { trendingComics } from "@/lib/mock-data";

export const metadata = { title: "Leaderboard" };

export default function LeaderboardPage() {
  return (
    <div className="asura-container py-10">
      <SectionHeading title="Leaderboard" />
      <LeaderboardTabs comics={trendingComics} />
    </div>
  );
}
