"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/star-rating";
import type { Comic } from "@/lib/types";
import { cn, formatCompact } from "@/lib/utils";

export function HeroSlider({ comics }: { comics: Comic[] }) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const count = comics.length;

  const go = React.useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count]
  );

  React.useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(id);
  }, [paused, count]);

  if (count === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured comics"
      className="relative h-[340px] w-full overflow-hidden rounded-lg sm:h-[420px] lg:h-[480px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {comics.map((comic, i) => (
        <div
          key={comic.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          )}
          aria-hidden={i !== index}
        >
          <Image
            src={comic.bannerImage ?? comic.coverImage}
            alt={comic.title}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

          <div className="absolute inset-0 flex items-end">
            <div className="container max-w-screen-2xl pb-10 sm:pb-14">
              <div className="max-w-xl">
                <div className="mb-3 flex flex-wrap gap-2">
                  {comic.genres.slice(0, 3).map((g) => (
                    <Badge key={g.id} variant="outline" className="bg-black/40">
                      {g.name}
                    </Badge>
                  ))}
                </div>
                <h2 className="text-balance text-2xl font-extrabold leading-tight text-white drop-shadow sm:text-4xl">
                  {comic.title}
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-brand-text-secondary">
                  <StarRating value={comic.avgRating} showValue size={16} />
                  <span>{comic.chapters.length} Chapters</span>
                  <span>{formatCompact(comic.totalViews)} Views</span>
                </div>
                <p className="mt-3 line-clamp-2 max-w-lg text-sm text-brand-text-secondary sm:line-clamp-3">
                  {comic.synopsis}
                </p>
                <div className="mt-5 flex gap-3">
                  <Button asChild size="lg">
                    <Link href={`/comics/${comic.slug}/chapter/1`}>
                      <BookOpen className="h-4 w-4" /> Read Now
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <Link href={`/comics/${comic.slug}`}>Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* arrows */}
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur transition-colors hover:bg-brand-purple sm:block"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur transition-colors hover:bg-brand-purple sm:block"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* dots */}
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {comics.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={cn(
              "h-2 rounded-full transition-all duration-150",
              i === index ? "w-6 bg-brand-purple" : "w-2 bg-white/40 hover:bg-white/70"
            )}
          />
        ))}
      </div>
    </section>
  );
}
