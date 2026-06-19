import Link from "next/link";
import Image from "next/image";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getLeaderboard } from "@/lib/comics";
import { formatViews } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface LeaderboardContentProps {
  period: "weekly" | "monthly" | "alltime";
}

export async function LeaderboardContent({ period }: LeaderboardContentProps) {
  const data = await getLeaderboard(period);

  return (
    <Tabs defaultValue={period} className="w-full">
      <TabsList className="mb-6 grid w-full grid-cols-3 bg-brand-card">
        <TabsTrigger value="weekly" asChild>
          <Link href="/leaderboard?period=weekly">Weekly</Link>
        </TabsTrigger>
        <TabsTrigger value="monthly" asChild>
          <Link href="/leaderboard?period=monthly">Monthly</Link>
        </TabsTrigger>
        <TabsTrigger value="alltime" asChild>
          <Link href="/leaderboard?period=alltime">All-time</Link>
        </TabsTrigger>
      </TabsList>

      <TabsContent value={period}>
        <ol className="space-y-2" aria-label="Leaderboard rankings">
          {data.map((item, i) => {
            const rankChange = i % 3 === 0 ? "up" : i % 3 === 1 ? "down" : "same";

            return (
              <li key={item.comic.id}>
                <Link
                  href={`/comics/${item.comic.slug}`}
                  className="flex items-center gap-4 rounded-lg border border-brand-surface bg-brand-card p-3 transition-colors duration-150 hover:bg-brand-card-hover"
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold",
                      item.rank <= 3 ? "bg-brand-purple text-white" : "bg-brand-surface text-brand-text-secondary"
                    )}
                  >
                    {item.rank}
                  </span>

                  <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-cover">
                    <Image
                      src={item.comic.coverImage}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-brand-text-primary">
                      {item.comic.title}
                    </p>
                    <p className="text-xs text-brand-text-secondary">
                      {formatViews(item.views)} reads
                    </p>
                  </div>

                  <div className="shrink-0">
                    {rankChange === "up" && (
                      <TrendingUp className="h-5 w-5 text-brand-badge-new" aria-label="Rank up" />
                    )}
                    {rankChange === "down" && (
                      <TrendingDown className="h-5 w-5 text-brand-badge-hot" aria-label="Rank down" />
                    )}
                    {rankChange === "same" && (
                      <Minus className="h-5 w-5 text-brand-muted" aria-label="No change" />
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </TabsContent>
    </Tabs>
  );
}
