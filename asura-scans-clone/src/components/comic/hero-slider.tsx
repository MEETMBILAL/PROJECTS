"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GenreBadge } from "@/components/comic/genre-badge";
import { cn, formatChapterNumber } from "@/lib/utils";
import type { ComicCardData } from "@/lib/types";

export function HeroSlider({ comics }: { comics: ComicCardData[] }) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const count = comics.length;

  const go = React.useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  React.useEffect(() => {
    if (paused || count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(t);
  }, [paused, count]);

  if (count === 0) return null;

  return (
    <section
      className="relative h-[340px] w-full overflow-hidden rounded-lg border border-brand-surface sm:h-[420px] md:h-[460px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured comics"
    >
      {comics.map((comic, i) => {
        const latest = comic.chapters?.[0]?.number;
        return (
          <div
            key={comic.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              i === index ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            aria-hidden={i !== index}
          >
            <Image
              src={comic.coverImage}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 sm:p-8 md:max-w-2xl">
              <div className="flex flex-wrap gap-2">
                {comic.genres?.slice(0, 3).map((g) => (
                  <GenreBadge key={g.genre.id} name={g.genre.name} slug={g.genre.slug} asLink={false} />
                ))}
              </div>
              <h1 className="line-clamp-2 text-2xl font-extrabold leading-tight text-white drop-shadow sm:text-4xl">
                {comic.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-brand-text-secondary">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-brand-gold text-brand-gold" />
                  <span className="font-semibold text-white">{comic.avgRating.toFixed(1)}</span> / 10
                </span>
                {latest != null && (
                  <span>{formatChapterNumber(latest)} Chapters</span>
                )}
              </div>
              <div className="mt-1 flex gap-3">
                <Button asChild size="lg">
                  <Link href={`/comics/${comic.slug}/chapter/${latest ?? 1}`}>
                    <BookOpen className="h-4 w-4" />
                    Read Now
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href={`/comics/${comic.slug}`}>Details</Link>
                </Button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Arrows */}
      {count > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-brand-purple sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-brand-purple sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {count > 1 && (
        <div className="absolute bottom-3 right-4 flex gap-2">
          {comics.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "h-2 rounded-full transition-all duration-150",
                i === index ? "w-6 bg-brand-purple" : "w-2 bg-white/40 hover:bg-white/70",
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
