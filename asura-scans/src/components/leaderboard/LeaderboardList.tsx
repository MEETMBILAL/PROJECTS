"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RatingStars } from "@/components/comics/RatingStars";
import { Skeleton } from "@/components/ui/skeleton";
import { formatViews } from "@/lib/utils";

interface LeaderboardEntry {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  avgRating: number;
  rank: number;
  periodViews: number;
}

export function LeaderboardList() {
  const [period, setPeriod] = useState("weekly");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?period=${period}`)
      .then((res) => res.json())
      .then((data) => setEntries(data.data ?? []))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <Tabs value={period} onValueChange={setPeriod}>
      <TabsList className="mb-6">
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="alltime">All Time</TabsTrigger>
      </TabsList>

      {(["weekly", "monthly", "alltime"] as const).map((p) => (
        <TabsContent key={p} value={p}>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry, i) => (
                <Link
                  key={entry.id}
                  href={`/comics/${entry.slug}`}
                  className="flex items-center gap-4 p-3 rounded-lg bg-brand-card border border-brand-surface hover:bg-brand-card-hover transition-colors group"
                >
                  <span className="text-2xl font-bold text-brand-purple w-8 text-center">
                    {entry.rank}
                  </span>
                  <Image
                    src={entry.coverImage}
                    alt={entry.title}
                    width={48}
                    height={64}
                    className="rounded-md aspect-[3/4] object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-brand-purple-light transition-colors truncate">
                      {entry.title}
                    </h3>
                    <RatingStars rating={entry.avgRating} size="sm" className="mt-1" />
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-brand-text-secondary">
                      {formatViews(entry.periodViews)} views
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      {i < 3 ? (
                        <ArrowUp className="h-3 w-3 text-brand-badge-new" />
                      ) : i > 6 ? (
                        <ArrowDown className="h-3 w-3 text-brand-badge-hot" />
                      ) : (
                        <Minus className="h-3 w-3 text-brand-text-muted" />
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
