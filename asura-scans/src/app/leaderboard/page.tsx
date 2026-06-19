"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarRating } from "@/components/comics/StarRating";
import { Skeleton } from "@/components/ui/skeleton";
import { formatViews } from "@/lib/utils";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { LeaderboardEntry } from "@/types";

function RankChange({ change }: { change: number }) {
  if (change > 0)
    return (
      <span className="flex items-center text-brand-new text-xs">
        <ArrowUp className="h-3 w-3" /> {change}
      </span>
    );
  if (change < 0)
    return (
      <span className="flex items-center text-brand-hot text-xs">
        <ArrowDown className="h-3 w-3" /> {Math.abs(change)}
      </span>
    );
  return <Minus className="h-3 w-3 text-brand-muted" />;
}

function LeaderboardList({ period }: { period: string }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?period=${period}`)
      .then((r) => r.json())
      .then((data) => setEntries(data.data ?? []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [period]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <Link
          key={entry.comic.id}
          href={`/comics/${entry.comic.slug}`}
          className="flex items-center gap-4 p-3 rounded-cover border border-brand-surface bg-brand-card hover:bg-brand-card-hover transition-colors"
        >
          <span className="text-2xl font-bold text-brand-purple w-8 text-center">
            {entry.rank}
          </span>
          <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-cover">
            <Image
              src={entry.comic.coverImage}
              alt={entry.comic.title}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{entry.comic.title}</p>
            <div className="flex items-center gap-3 mt-1">
              <StarRating rating={entry.comic.avgRating} size="sm" />
              <span className="text-xs text-brand-muted">
                {formatViews(entry.views)} views
              </span>
            </div>
          </div>
          <RankChange change={entry.rankChange} />
        </Link>
      ))}
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="section-heading text-2xl mb-8">Leaderboard</h1>
      <Tabs defaultValue="weekly">
        <TabsList className="mb-6">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="alltime">All Time</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly">
          <LeaderboardList period="weekly" />
        </TabsContent>
        <TabsContent value="monthly">
          <LeaderboardList period="monthly" />
        </TabsContent>
        <TabsContent value="alltime">
          <LeaderboardList period="alltime" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
