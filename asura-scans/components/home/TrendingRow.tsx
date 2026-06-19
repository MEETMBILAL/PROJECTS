"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ComicCard } from "@/components/comics/ComicCard";
import type { ComicListItem } from "@/types";
import { Button } from "@/components/ui/button";

interface TrendingRowProps {
  comics: ComicListItem[];
}

export function TrendingRow({ comics }: TrendingRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <div className="absolute -left-2 top-1/2 z-10 hidden -translate-y-1/2 md:block">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll("left")}
          className="rounded-full bg-brand-card/80 text-white hover:bg-brand-purple"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin md:grid md:grid-cols-5 md:overflow-visible md:pb-0"
      >
        {comics.map((comic, i) => (
          <div key={comic.id} className="w-[160px] shrink-0 md:w-auto">
            <ComicCard comic={comic} rank={i + 1} />
          </div>
        ))}
      </div>

      <div className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 md:block">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll("right")}
          className="rounded-full bg-brand-card/80 text-white hover:bg-brand-purple"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
