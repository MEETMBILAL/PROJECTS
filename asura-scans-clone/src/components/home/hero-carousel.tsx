"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GenreBadge } from "@/components/comics/genre-badge";
import { StatusBadge } from "@/components/comics/status-badge";
import { cn, formatCompact } from "@/lib/utils";
import type { ComicDetailData } from "@/types";

const INTERVAL = 5000;

export function HeroCarousel({ comics }: { comics: ComicDetailData[] }) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const count = comics.length;

  const go = React.useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count]
  );

  React.useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => clearInterval(id);
  }, [paused, count]);

  if (count === 0) return null;

  return (
    <section
      className="relative h-[420px] w-full overflow-hidden sm:h-[480px] lg:h-[540px]"
      aria-roledescription="carousel"
      aria-label="Featured comics"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {comics.map((comic, i) => (
        <div
          key={comic.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          )}
          aria-hidden={i !== index}
        >
          <Image
            src={comic.bannerImage ?? comic.coverImage}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/70 to-brand-bg/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-bg/90 via-brand-bg/40 to-transparent" />

          <div className="container relative flex h-full flex-col justify-end pb-12 sm:pb-16">
            <div className="max-w-xl">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <StatusBadge status={comic.status} />
                {(comic.genres ?? []).slice(0, 3).map((g) => (
                  <GenreBadge key={g} name={g} />
                ))}
              </div>
              <h1 className="mb-3 text-3xl font-extrabold leading-tight text-white drop-shadow sm:text-4xl lg:text-5xl">
                {comic.title}
              </h1>
              <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-brand-text-secondary">
                <span className="inline-flex items-center gap-1 text-brand-gold">
                  <Star className="h-4 w-4" fill="currentColor" />
                  <span className="font-semibold">{comic.avgRating.toFixed(1)}</span>
                  <span className="text-brand-text-muted">/ 10</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {comic.chapterCount} Chapters
                </span>
                <span>{formatCompact(comic.totalViews)} views</span>
              </div>
              <p className="mb-5 line-clamp-2 max-w-lg text-sm text-brand-text-secondary sm:line-clamp-3">
                {comic.synopsis}
              </p>
              <div className="flex items-center gap-3">
                <Button asChild size="lg">
                  <Link href={`/comics/${comic.slug}`}>
                    <BookOpen className="h-4 w-4" />
                    Read Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* arrows */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-brand-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-brand-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* dots */}
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {comics.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "h-2 rounded-full transition-all duration-150",
                  i === index ? "w-6 bg-brand-purple" : "w-2 bg-white/50 hover:bg-white"
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
