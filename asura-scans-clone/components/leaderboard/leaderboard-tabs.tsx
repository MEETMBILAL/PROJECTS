"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUp } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCompactNumber } from "@/lib/format";
import type { Comic } from "@/lib/types";

export function LeaderboardTabs({ comics }: { comics: Comic[] }) {
  const slices = {
    weekly: comics.slice(0, 15),
    monthly: [...comics].sort((a, b) => b.avgRating - a.avgRating).slice(0, 15),
    all: [...comics].sort((a, b) => b.totalViews - a.totalViews).slice(0, 15),
  };

  return (
    <Tabs defaultValue="weekly" className="w-full">
      <TabsList className="bg-brand-card">
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="all">All-time</TabsTrigger>
      </TabsList>
      {Object.entries(slices).map(([key, list]) => (
        <TabsContent key={key} value={key} className="mt-5 grid gap-3">
          {list.map((comic, index) => (
            <Link key={comic.id} href={`/comics/${comic.slug}`} className="grid grid-cols-[48px_64px_1fr_auto] items-center gap-4 rounded-xl border border-brand-surface bg-brand-card p-3 hover:border-brand-primary hover:bg-brand-hover">
              <span className="text-center text-2xl font-black text-brand-light">{index + 1}</span>
              <Image src={comic.coverImage} alt={comic.title} width={64} height={86} className="aspect-[3/4] rounded-md object-cover" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">{comic.title}</p>
                <p className="mt-1 text-sm text-brand-secondary">{formatCompactNumber(comic.totalViews)} views</p>
              </div>
              <span className={index % 3 === 0 ? "text-brand-new" : "text-brand-hot"} aria-label="Rank change">
                {index % 3 === 0 ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
              </span>
            </Link>
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}
