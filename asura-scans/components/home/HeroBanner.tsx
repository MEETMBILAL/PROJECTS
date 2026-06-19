"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn, formatRating } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GenreTag } from "@/components/comics/GenreTag";

interface FeaturedComic {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  bannerImage?: string | null;
  synopsis: string;
  avgRating: number;
  chapterCount: number;
  genres: Array<{ id: string; name: string; slug: string }>;
}

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

  if (comics.length === 0) return null;

  const comic = comics[current];
  const bgImage = comic.bannerImage ?? comic.coverImage;

  return (
    <section className="relative h-[420px] w-full overflow-hidden md:h-[500px]" aria-label="Featured comics">
      {comics.map((c, i) => (
        <div
          key={c.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <Image
            src={bgImage}
            alt=""
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-12 lg:px-6">
        <div className="max-w-xl">
          <div className="mb-3 flex flex-wrap gap-2">
            {comic.genres.slice(0, 3).map((g) => (
              <GenreTag key={g.id} name={g.name} slug={g.slug} />
            ))}
          </div>

          <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {comic.title}
          </h1>

          <div className="mb-4 flex items-center gap-4 text-sm text-brand-text-secondary">
            <span className="flex items-center gap-1 text-brand-gold">
              <Star className="h-4 w-4 fill-brand-gold" />
              {formatRating(comic.avgRating)} / 10
            </span>
            <span>{comic.chapterCount} Chapters</span>
          </div>

          <p className="mb-6 line-clamp-2 text-sm text-brand-text-secondary md:line-clamp-3">
            {comic.synopsis}
          </p>

          <Button asChild className="bg-brand-purple hover:bg-brand-purple-light text-white">
            <Link href={`/comics/${comic.slug}`}>Read Now</Link>
          </Button>
        </div>
      </div>

      {/* Controls */}
      {comics.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-brand-purple"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-brand-purple"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2" role="tablist" aria-label="Slide navigation">
            {comics.map((c, i) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={i === current}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setCurrent(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-150",
                  i === current ? "w-6 bg-brand-purple" : "w-2 bg-white/40 hover:bg-white/60"
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
