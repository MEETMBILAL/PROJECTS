"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp, ChevronDown, Minus, Eye, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatCompact, chapterLabel } from "@/lib/utils";
import type { LeaderboardEntry } from "@/types";

type Period = "weekly" | "monthly" | "all";

export function LeaderboardList({
  initial,
  initialPeriod = "weekly",
}: {
  initial: LeaderboardEntry[];
  initialPeriod?: Period;
}) {
  const [period, setPeriod] = React.useState<Period>(initialPeriod);
  const [items, setItems] = React.useState(initial);
  const [loading, setLoading] = React.useState(false);
  const cache = React.useRef<Record<string, LeaderboardEntry[]>>({
    [initialPeriod]: initial,
  });

  async function changePeriod(p: Period) {
    setPeriod(p);
    if (cache.current[p]) {
      setItems(cache.current[p]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?period=${p}`);
      if (res.ok) {
        const data = await res.json();
        cache.current[p] = data.items;
        setItems(data.items);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Tabs value={period} onValueChange={(v) => changePeriod(v as Period)}>
        <TabsList>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="all">All-time</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6 overflow-hidden rounded-lg border border-brand-surface">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-brand-purple" />
          </div>
        ) : (
          <ul className="divide-y divide-brand-surface">
            {items.map((entry) => (
              <li key={entry.id}>
                <Link
                  href={`/comics/${entry.slug}`}
                  className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-brand-card-hover"
                >
                  <div className="flex w-10 shrink-0 items-center justify-center">
                    <span
                      className={cn(
                        "text-lg font-bold",
                        entry.rank === 1 && "text-brand-gold",
                        entry.rank === 2 && "text-slate-300",
                        entry.rank === 3 && "text-amber-600",
                        entry.rank > 3 && "text-brand-text-muted"
                      )}
                    >
                      {entry.rank}
                    </span>
                  </div>

                  <RankChange change={entry.rankChange} />

                  <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded">
                    <Image
                      src={entry.coverImage}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {entry.title}
                    </p>
                    <p className="truncate text-xs text-brand-text-secondary">
                      {entry.latestChapters[0]
                        ? chapterLabel(entry.latestChapters[0].number)
                        : "No chapters"}
                    </p>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1.5 text-sm text-brand-text-secondary">
                    <Eye className="h-4 w-4" />
                    {formatCompact(entry.periodViews)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function RankChange({ change }: { change: number }) {
  if (change > 0)
    return (
      <span className="inline-flex w-8 items-center justify-center gap-0.5 text-xs font-medium text-brand-new">
        <ChevronUp className="h-4 w-4" />
        {change}
      </span>
    );
  if (change < 0)
    return (
      <span className="inline-flex w-8 items-center justify-center gap-0.5 text-xs font-medium text-brand-hot">
        <ChevronDown className="h-4 w-4" />
        {Math.abs(change)}
      </span>
    );
  return (
    <span className="inline-flex w-8 items-center justify-center text-brand-text-muted">
      <Minus className="h-3 w-3" />
    </span>
  );
}
