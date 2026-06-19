"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/comics/StarRating";
import { ComicCardData } from "@/types";

interface HeroBannerProps {
  comics: ComicCardData[];
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
  }, [next, comics.length]);

  if (comics.length === 0) return null;

  const comic = comics[current];

  return (
    <section className="relative h-[400px] md:h-[500px] overflow-hidden" aria-label="Featured comics">
      {comics.map((c, i) => (
        <div
          key={c.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={c.coverImage}
            alt=""
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 flex h-full items-end">
        <div className="container mx-auto px-4 pb-12">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {comic.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <StarRating rating={comic.avgRating} size="md" />
              {comic.latestChapter && (
                <span className="text-brand-secondary text-sm">
                  {comic.latestChapter} Chapters
                </span>
              )}
              {comic.isNew && <Badge variant="new">NEW</Badge>}
            </div>
            <Button asChild size="lg">
              <Link href={`/comics/${comic.slug}`}>Read Now</Link>
            </Button>
          </div>
        </div>
      </div>

      {comics.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-brand-purple transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-brand-purple transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {comics.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-150 ${
                  i === current
                    ? "w-6 bg-brand-purple"
                    : "w-2 bg-white/50 hover:bg-white/80"
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
