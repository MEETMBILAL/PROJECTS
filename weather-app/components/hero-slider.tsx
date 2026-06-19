"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Comic } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function HeroSlider({ comics }: { comics: Comic[] }) {
  const [active, setActive] = useState(0);
  const current = comics[active];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActive((index) => (index + 1) % comics.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [comics.length]);

  const move = (direction: 1 | -1) => {
    setActive((index) => (index + direction + comics.length) % comics.length);
  };

  return (
    <section className="relative min-h-[520px] overflow-hidden border-b border-brand-surface bg-black">
      {comics.map((comic, index) => (
        <Image
          key={comic.id}
          src={comic.bannerImage}
          alt=""
          fill
          priority={index === 0}
          sizes="100vw"
          className={cn("object-cover opacity-0 transition-opacity duration-500", index === active && "opacity-60")}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-background via-transparent to-transparent" />

      <div className="container-shell relative flex min-h-[520px] items-end pb-14 pt-24">
        <div className="max-w-3xl">
          <div className="mb-4 flex flex-wrap gap-2">
            {current.genres.slice(0, 4).map((genre) => (
              <Badge key={genre} variant="outline" className="bg-black/35">
                {genre}
              </Badge>
            ))}
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">{current.title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-brand-textSecondary md:text-base">{current.synopsis}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-semibold text-brand-textSecondary">
            <span className="flex items-center gap-1 text-white">
              <Star className="h-4 w-4 fill-brand-ratingGold text-brand-ratingGold" />
              {current.avgRating.toFixed(1)} / 10
            </span>
            <span>{current.chapters.length} Chapters</span>
            <span>{current.status}</span>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={`/comics/${current.slug}/chapter/${current.chapters.at(-1)?.number ?? 1}`}>
                <Play className="h-4 w-4 fill-current" />
                Read Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/comics/${current.slug}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container-shell absolute inset-x-0 bottom-6 flex items-center justify-between">
        <div className="flex gap-2">
          {comics.map((comic, index) => (
            <button
              key={comic.id}
              type="button"
              onClick={() => setActive(index)}
              className={cn("h-2.5 w-2.5 rounded-full bg-white/35", index === active && "w-8 bg-brand-primary")}
              aria-label={`Show ${comic.title}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="icon" onClick={() => move(-1)} aria-label="Previous featured comic">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="secondary" size="icon" onClick={() => move(1)} aria-label="Next featured comic">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
