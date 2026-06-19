"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GenreBadge } from "@/components/comics/GenreBadge";
import { RatingStars } from "@/components/comics/RatingStars";
import type { ComicListItem } from "@/lib/types";

interface FeaturedComic extends ComicListItem {
  synopsis?: string;
}

interface HeroBannerProps {
  comics: FeaturedComic[];
}

export function HeroBanner({ comics }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % comics.length);
  }, [comics.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + comics.length) % comics.length);
  }, [comics.length]);

  useEffect(() => {
    if (comics.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [comics.length, next]);

  if (comics.length === 0) return null;

  const comic = comics[current];

  return (
    <section className="relative w-full h-[400px] sm:h-[500px] overflow-hidden" aria-label="Featured comics">
      {comics.map((c, i) => (
        <div
          key={c.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src={c.coverImage}
            alt=""
            fill
            className="object-cover"
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>
      ))}

      <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-12">
        <div className="max-w-xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">{comic.title}</h2>
          {comic.genres && (
            <div className="flex flex-wrap gap-2 mb-3">
              {comic.genres.slice(0, 4).map((g) => (
                <GenreBadge key={g.slug} name={g.name} slug={g.slug} />
              ))}
            </div>
          )}
          <RatingStars rating={comic.avgRating} count={comic.ratingCount} size="lg" className="mb-3" />
          {comic.latestChapter && (
            <p className="text-brand-text-secondary mb-4">
              {Math.floor(comic.latestChapter.number)} Chapters Available
            </p>
          )}
          <Button asChild size="lg">
            <Link href={`/comics/${comic.slug}`}>Read Now</Link>
          </Button>
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
                className={`h-2 rounded-full transition-all duration-150 ${
                  i === current ? "w-6 bg-brand-purple" : "w-2 bg-white/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
