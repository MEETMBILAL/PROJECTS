import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

import { SectionTitle } from "@/components/section-title";
import { Badge } from "@/components/ui/badge";
import { getTrendingComics } from "@/lib/mock-data";
import { formatViews } from "@/lib/utils";

export const metadata = {
  title: "Leaderboard",
};

export default function LeaderboardPage({ searchParams }: { searchParams: { tab?: "weekly" | "monthly" | "all" } }) {
  const active = searchParams.tab ?? "weekly";
  const comics = getTrendingComics(20);

  return (
    <div className="container-shell space-y-6 py-10">
      <SectionTitle title="Leaderboard" />
      <div className="flex rounded-xl border border-brand-surface bg-brand-card p-1">
        {[
          { value: "weekly", label: "Weekly" },
          { value: "monthly", label: "Monthly" },
          { value: "all", label: "All-time" },
        ].map((tab) => (
          <Link
            key={tab.value}
            href={`/leaderboard?tab=${tab.value}`}
            className={`flex-1 rounded-lg px-4 py-2 text-center text-sm font-bold ${
              active === tab.value ? "bg-brand-primary text-white" : "text-brand-textSecondary hover:bg-brand-cardHover hover:text-white"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-brand-surface bg-brand-card">
        {comics.map((comic, index) => (
          <Link key={comic.id} href={`/comics/${comic.slug}`} className="grid grid-cols-[48px_64px_1fr_auto] items-center gap-4 border-b border-brand-surface p-3 hover:bg-brand-cardHover md:grid-cols-[64px_76px_1fr_160px_80px]">
            <span className="text-center text-2xl font-black text-white">#{index + 1}</span>
            <Image src={comic.coverImage} alt="" width={64} height={86} className="cover-aspect rounded-lg object-cover" />
            <div className="min-w-0">
              <h2 className="truncate font-bold text-white">{comic.title}</h2>
              <p className="text-sm text-brand-textSecondary">Chapter {comic.chapters[0]?.number ?? 1}</p>
            </div>
            <span className="hidden font-semibold text-brand-textSecondary md:block">{formatViews(comic.totalViews)} views</span>
            <Badge variant={comic.rankChange > 0 ? "new" : comic.rankChange < 0 ? "hot" : "secondary"} className="gap-1">
              {comic.rankChange > 0 ? <ArrowUp className="h-3 w-3" /> : comic.rankChange < 0 ? <ArrowDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
              {Math.abs(comic.rankChange)}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
