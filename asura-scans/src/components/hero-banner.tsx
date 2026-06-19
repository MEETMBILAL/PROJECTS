"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "./star-rating";
import { GenreBadge } from "./badge";
import { FeaturedComic } from "@/types";
import { cn } from "@/lib/utils";

interface HeroBannerProps {
  comics: FeaturedComic[];
}

export function HeroBanner({ comics }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % comics.length);
  }, [comics.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + comics.length) % comics.length);
  }, [comics.length]);

  useEffect(() => {
    if (comics.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, comics.length]);

  if (!comics.length) return null;

  const comic = comics[current];

  return (
    <section className="relative h-[400px] md:h-[500px] overflow-hidden" aria-label="Featured comics">
      {comics.map((c, i) => (
        <div
          key={c.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <Image
            src={c.coverImage}
            alt=""
            fill
            className="object-cover object-top"
            priority={i === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12">
        <div className="max-w-xl">
          <div className="flex flex-wrap gap-2 mb-3">
            {comic.genres.slice(0, 3).map((g) => (
              <GenreBadge key={g}>{g}</GenreBadge>
            ))}
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
            {comic.title}
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <StarRating rating={comic.avgRating} size="md" />
            <span className="text-brand-text-secondary text-sm">
              {comic.chapterCount} Chapters
            </span>
          </div>
          <Link href={`/comics/${comic.slug}`}>
            <Button size="lg" aria-label={`Read ${comic.title} now`}>
              Read Now
            </Button>
          </Link>
        </div>
      </div>

      {comics.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-brand-purple transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-brand-purple transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {comics.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-150",
                  i === current ? "w-6 bg-brand-purple" : "w-2 bg-white/50"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
