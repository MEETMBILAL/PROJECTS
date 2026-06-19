"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ComicCard } from "./comic-card";
import type { ComicCardDTO } from "@/lib/types";

/**
 * Horizontal scrollable rail of comic cards (used for Trending / Related).
 * On desktop, displays as a scrollable row with arrow controls; the same
 * markup degrades to a touch-scroll row on mobile.
 */
export function ComicRail({ comics, ranked = false }: { comics: ComicCardDTO[]; ranked?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="group/rail relative">
      <div
        ref={ref}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
      >
        {comics.map((comic, i) => (
          <div
            key={comic.id}
            className="w-[40vw] shrink-0 snap-start sm:w-[26vw] md:w-[20vw] lg:w-[15.5%] xl:w-[12.5%]"
          >
            <ComicCard comic={comic} rank={ranked ? i + 1 : undefined} />
          </div>
        ))}
      </div>

      <button
        aria-label="Scroll left"
        onClick={() => scroll(-1)}
        className="absolute -left-3 top-[35%] hidden h-10 w-10 items-center justify-center rounded-full border border-brand-surface bg-brand-card text-white opacity-0 shadow-nav transition-opacity hover:bg-brand-purple group-hover/rail:opacity-100 md:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        aria-label="Scroll right"
        onClick={() => scroll(1)}
        className="absolute -right-3 top-[35%] hidden h-10 w-10 items-center justify-center rounded-full border border-brand-surface bg-brand-card text-white opacity-0 shadow-nav transition-opacity hover:bg-brand-purple group-hover/rail:opacity-100 md:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
