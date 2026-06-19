"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { GenreBadge } from "@/components/genre-badge";
import { RatingStars } from "@/components/rating-stars";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Comic } from "@/types/comic";

export function HeroCarousel({ comics }: { comics: Comic[] }) {
  const [active, setActive] = useState(0);
  const featured = comics.slice(0, 5);
  const comic = featured[active];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % featured.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [featured.length]);

  if (!comic) {
    return null;
  }

  function move(delta: number) {
    setActive((current) => (current + delta + featured.length) % featured.length);
  }

  return (
    <section className="relative min-h-[520px] overflow-hidden border-b border-brand-surface">
      <Image
        src={comic.bannerImage ?? comic.coverImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-brand-background to-transparent" />

      <div className="container-shell relative z-10 flex min-h-[520px] items-center py-16">
        <div className="max-w-2xl">
          <div className="mb-4 flex flex-wrap gap-2">
            {comic.genres.slice(0, 4).map((genre) => (
              <GenreBadge key={genre.id} name={genre.name} slug={genre.slug} />
            ))}
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">{comic.title}</h1>
          <p className="mt-4 line-clamp-3 max-w-xl text-sm leading-6 text-brand-textSecondary sm:text-base">
            {comic.synopsis}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-brand-textSecondary">
            <RatingStars value={comic.avgRating} />
            <span>{comic.chapters.length} Chapters</span>
            <span>{comic.type}</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={`/comics/${comic.slug}/chapter/${comic.chapters.at(-1)?.number ?? 1}`}>
                <Play className="h-4 w-4 fill-white" aria-hidden />
                Read Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/comics/${comic.slug}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container-shell absolute inset-x-0 bottom-8 z-20 flex items-center justify-between">
        <div className="flex gap-2">
          {featured.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                "h-2.5 rounded-full transition-all duration-150",
                index === active ? "w-8 bg-brand-primary" : "w-2.5 bg-white/40 hover:bg-white"
              )}
              aria-label={`Show ${item.title}`}
            />
          ))}
        </div>
        <div className="hidden gap-2 md:flex">
          <Button variant="secondary" size="icon" onClick={() => move(-1)} aria-label="Previous featured comic">
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </Button>
          <Button variant="secondary" size="icon" onClick={() => move(1)} aria-label="Next featured comic">
            <ChevronRight className="h-5 w-5" aria-hidden />
          </Button>
        </div>
      </div>
    </section>
  );
}
