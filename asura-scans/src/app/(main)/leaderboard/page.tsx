import { LeaderboardList } from "@/components/leaderboard/LeaderboardList";

export const metadata = { title: "Leaderboard" };

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="section-heading text-2xl mb-6">Popular Comics</h1>
      <LeaderboardList />
    </div>
  );
}
