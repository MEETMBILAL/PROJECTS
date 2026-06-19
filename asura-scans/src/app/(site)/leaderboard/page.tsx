"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarRating } from "@/components/star-rating";
import { LeaderboardItem } from "@/types";
import { formatViews } from "@/lib/utils";

export default function LeaderboardPage() {
  const [period, setPeriod] = useState("weekly");
  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?period=${period}`)
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionHeading>Leaderboard</SectionHeading>

      <Tabs value={period} onValueChange={setPeriod} className="mb-8">
        <TabsList>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="alltime">All Time</TabsTrigger>
        </TabsList>
        <TabsContent value={period}>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-16 bg-brand-card rounded-cover animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <Link
                  key={item.comic.id}
                  href={`/comics/${item.comic.slug}`}
                  className="flex items-center gap-4 p-3 bg-brand-card rounded-cover hover:bg-brand-card-hover transition-colors"
                >
                  <span className="text-2xl font-bold text-brand-purple w-8 text-center">
                    {item.rank}
                  </span>
                  <div className="relative w-12 aspect-cover rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.comic.coverImage}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">
                      {item.comic.title}
                    </p>
                    <StarRating rating={item.comic.avgRating} size="sm" />
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-brand-text-secondary">
                      {formatViews(item.views)} views
                    </p>
                    <div className="flex items-center justify-end gap-1 text-xs">
                      {item.rankChange > 0 ? (
                        <TrendingUp className="h-3 w-3 text-brand-badge-new" />
                      ) : item.rankChange < 0 ? (
                        <TrendingDown className="h-3 w-3 text-brand-badge-hot" />
                      ) : (
                        <Minus className="h-3 w-3 text-brand-muted" />
                      )}
                      <span
                        className={
                          item.rankChange > 0
                            ? "text-brand-badge-new"
                            : item.rankChange < 0
                              ? "text-brand-badge-hot"
                              : "text-brand-muted"
                        }
                      >
                        {Math.abs(item.rankChange)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
