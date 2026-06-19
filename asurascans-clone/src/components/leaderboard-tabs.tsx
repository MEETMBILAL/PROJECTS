"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Minus, TrendingDown, TrendingUp } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LeaderboardEntry } from "@/lib/types";
import { cn, formatCompact } from "@/lib/utils";

interface LeaderboardTabsProps {
  weekly: LeaderboardEntry[];
  monthly: LeaderboardEntry[];
  alltime: LeaderboardEntry[];
}

function RankChange({ change }: { change: number }) {
  if (change > 0)
    return (
      <span className="flex items-center gap-0.5 text-xs font-medium text-brand-new">
        <TrendingUp className="h-3.5 w-3.5" /> {change}
      </span>
    );
  if (change < 0)
    return (
      <span className="flex items-center gap-0.5 text-xs font-medium text-brand-hot">
        <TrendingDown className="h-3.5 w-3.5" /> {Math.abs(change)}
      </span>
    );
  return (
    <span className="flex items-center gap-0.5 text-xs text-brand-text-muted">
      <Minus className="h-3.5 w-3.5" />
    </span>
  );
}

function List({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <ol className="divide-y divide-brand-border/60 overflow-hidden rounded-lg border border-brand-border bg-brand-card">
      {entries.map((entry) => (
        <li key={entry.id}>
          <Link
            href={`/comics/${entry.slug}`}
            className="flex items-center gap-3 p-3 transition-colors hover:bg-brand-card-hover"
          >
            <span
              className={cn(
                "w-8 shrink-0 text-center text-lg font-extrabold",
                entry.rank === 1 && "text-brand-gold",
                entry.rank === 2 && "text-brand-text-secondary",
                entry.rank === 3 && "text-[#cd7f32]",
                entry.rank > 3 && "text-brand-text-muted"
              )}
            >
              {entry.rank}
            </span>
            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded">
              <Image
                src={entry.coverImage}
                alt={entry.title}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {entry.title}
              </p>
              <p className="flex items-center gap-1 text-xs text-brand-text-muted">
                <Eye className="h-3.5 w-3.5" />
                {formatCompact(entry.periodViews)} views
              </p>
            </div>
            <RankChange change={entry.rankChange} />
          </Link>
        </li>
      ))}
    </ol>
  );
}

export function LeaderboardTabs({
  weekly,
  monthly,
  alltime,
}: LeaderboardTabsProps) {
  return (
    <Tabs defaultValue="weekly">
      <TabsList>
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="alltime">All-time</TabsTrigger>
      </TabsList>
      <TabsContent value="weekly">
        <List entries={weekly} />
      </TabsContent>
      <TabsContent value="monthly">
        <List entries={monthly} />
      </TabsContent>
      <TabsContent value="alltime">
        <List entries={alltime} />
      </TabsContent>
    </Tabs>
  );
}
