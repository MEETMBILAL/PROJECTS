"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCompact } from "@/lib/utils";
import type { ComicDetailDTO } from "@/lib/types";

export function HeroSlider({ comics }: { comics: ComicDetailDTO[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = comics.length;

  const go = useCallback((next: number) => setIndex((next + count) % count), [count]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(t);
  }, [paused, count]);

  if (count === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured comics"
      className="relative h-[420px] w-full overflow-hidden sm:h-[480px] md:h-[540px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {comics.map((comic, i) => (
        <div
          key={comic.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            i === index ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          aria-hidden={i !== index}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={comic.bannerImage ?? comic.coverImage}
            alt=""
            className="h-full w-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/70 to-brand-bg/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-bg/90 via-brand-bg/40 to-transparent" />

          <div className="container relative flex h-full flex-col justify-end pb-12 md:justify-center md:pb-0">
            <div className="max-w-xl">
              <div className="mb-3 flex flex-wrap gap-2">
                {comic.genres.slice(0, 3).map((g) => (
                  <Badge key={g.id} variant="outline" className="bg-black/30 backdrop-blur-sm">
                    {g.name}
                  </Badge>
                ))}
              </div>
              <h1 className="text-shadow-lg text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
                {comic.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-brand-text-secondary">
                <span className="flex items-center gap-1 font-semibold text-brand-gold">
                  <Star className="h-4 w-4" fill="#FFD700" /> {comic.avgRating.toFixed(1)}
                </span>
                <span>{comic.chapterCount} Chapters</span>
                <span>{formatCompact(comic.totalViews)} Views</span>
              </div>
              <p className="mt-3 line-clamp-2 max-w-lg text-sm text-brand-text-secondary md:text-base">
                {comic.synopsis}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href={`/comics/${comic.slug}/chapter/1`}>
                    <Play fill="currentColor" /> Read Now
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href={`/comics/${comic.slug}`}>Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        aria-label="Previous slide"
        onClick={() => go(index - 1)}
        className="absolute left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-brand-purple sm:flex"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        aria-label="Next slide"
        onClick={() => go(index + 1)}
        className="absolute right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-brand-purple sm:flex"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {comics.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => go(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-150",
              i === index ? "w-6 bg-brand-purple" : "w-2 bg-white/40 hover:bg-white/70",
            )}
          />
        ))}
      </div>
    </section>
  );
}
