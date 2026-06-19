import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { comics } from "@/lib/mock-data";
import { compactNumber } from "@/lib/utils";

type LeaderboardPageProps = {
  searchParams: {
    tab?: "weekly" | "monthly" | "all";
  };
};

const tabs = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "all", label: "All-time" }
] as const;

export const metadata = {
  title: "Leaderboard"
};

export default function LeaderboardPage({ searchParams }: LeaderboardPageProps) {
  const active = searchParams.tab ?? "weekly";
  const ranked = [...comics].sort((a, b) => b.totalViews - a.totalViews).slice(0, 10);

  return (
    <div className="container-shell py-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="section-heading">Leaderboard</h1>
          <p className="mt-3 text-sm text-brand-textSecondary">Most-read comics ranked by reader activity.</p>
        </div>
        <div className="flex rounded-lg border border-brand-surface bg-brand-card p-1">
          {tabs.map((tab) => (
            <Link
              key={tab.value}
              href={`/leaderboard?tab=${tab.value}`}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-150 ${
                active === tab.value ? "bg-brand-primary text-white" : "text-brand-textSecondary hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        {ranked.map((comic, index) => {
          const improved = index % 3 !== 0;
          return (
            <Link
              key={comic.id}
              href={`/comics/${comic.slug}`}
              className="grid grid-cols-[48px_64px_1fr_auto] items-center gap-4 border-b border-brand-surface p-4 last:border-b-0 transition-colors duration-150 hover:bg-brand-cardHover"
            >
              <span className="text-2xl font-black text-white">#{index + 1}</span>
              <Image src={comic.coverImage} alt="" width={64} height={86} className="aspect-[3/4] rounded-md object-cover" />
              <span className="min-w-0">
                <span className="block truncate font-semibold text-white">{comic.title}</span>
                <span className="text-sm text-brand-textSecondary">{compactNumber(comic.totalViews)} views</span>
              </span>
              <Badge variant={improved ? "new" : "hot"} className="gap-1">
                {improved ? <ArrowUp className="h-3 w-3" aria-hidden /> : <ArrowDown className="h-3 w-3" aria-hidden />}
                {improved ? "+2" : "-1"}
              </Badge>
            </Link>
          );
        })}
      </Card>
    </div>
  );
}
