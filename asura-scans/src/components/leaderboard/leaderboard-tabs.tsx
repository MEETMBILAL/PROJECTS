"use client";

import Link from "next/link";
import { Minus, MoveUp, MoveDown, Eye, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatCompact } from "@/lib/utils";
import type { LeaderboardEntryDTO } from "@/lib/types";

interface LeaderboardTabsProps {
  weekly: LeaderboardEntryDTO[];
  monthly: LeaderboardEntryDTO[];
  allTime: LeaderboardEntryDTO[];
}

export function LeaderboardTabs({ weekly, monthly, allTime }: LeaderboardTabsProps) {
  return (
    <Tabs defaultValue="weekly">
      <TabsList>
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="alltime">All-time</TabsTrigger>
      </TabsList>
      <TabsContent value="weekly">
        <LeaderboardList entries={weekly} />
      </TabsContent>
      <TabsContent value="monthly">
        <LeaderboardList entries={monthly} />
      </TabsContent>
      <TabsContent value="alltime">
        <LeaderboardList entries={allTime} />
      </TabsContent>
    </Tabs>
  );
}

function RankChange({ change }: { change: number }) {
  if (change === 0) {
    return (
      <span className="flex items-center gap-0.5 text-xs text-brand-text-muted">
        <Minus className="h-3 w-3" />
      </span>
    );
  }
  const up = change > 0;
  return (
    <span
      className={cn(
        "flex items-center gap-0.5 text-xs font-semibold",
        up ? "text-brand-new" : "text-brand-hot",
      )}
    >
      {up ? <MoveUp className="h-3 w-3" /> : <MoveDown className="h-3 w-3" />}
      {Math.abs(change)}
    </span>
  );
}

function LeaderboardList({ entries }: { entries: LeaderboardEntryDTO[] }) {
  return (
    <ul className="divide-y divide-brand-surface overflow-hidden rounded-lg border border-brand-surface bg-brand-card">
      {entries.map((entry) => (
        <li key={entry.id}>
          <Link
            href={`/comics/${entry.slug}`}
            className="flex items-center gap-3 p-3 transition-colors hover:bg-brand-card-hover sm:gap-4 sm:p-4"
          >
            <div className="flex w-8 shrink-0 flex-col items-center">
              <span
                className={cn(
                  "text-lg font-extrabold tabular-nums",
                  entry.rank === 1 && "text-brand-gold",
                  entry.rank === 2 && "text-brand-text-secondary",
                  entry.rank === 3 && "text-brand-purple-light",
                  entry.rank > 3 && "text-brand-text-muted",
                )}
              >
                {entry.rank}
              </span>
              <RankChange change={entry.rankChange} />
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.coverImage}
              alt=""
              loading="lazy"
              className="h-16 w-12 shrink-0 rounded-md object-cover sm:h-20 sm:w-14"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white sm:text-base">
                {entry.title}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-text-secondary">
                <span className="flex items-center gap-1 text-brand-gold">
                  <Star className="h-3 w-3" fill="#FFD700" /> {entry.avgRating.toFixed(1)}
                </span>
                {entry.latestChapters[0] && <span>Ch. {entry.latestChapters[0].number}</span>}
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end">
              <span className="flex items-center gap-1 text-sm font-bold text-white">
                <Eye className="h-3.5 w-3.5 text-brand-text-muted" />
                {formatCompact(entry.periodViews)}
              </span>
              <span className="text-xs text-brand-text-muted">views</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
