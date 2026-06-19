"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Comic } from "@/lib/types";
import { cn } from "@/lib/utils";

export function HeroSlider({ comics }: { comics: Comic[] }) {
  const [active, setActive] = useState(0);
  const comic = comics[active];

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % comics.length), 5000);
    return () => window.clearInterval(timer);
  }, [comics.length]);

  if (!comic) return null;

  return (
    <section className="relative min-h-[520px] overflow-hidden border-b border-brand-surface" aria-label="Featured comics">
      <Image src={comic.bannerImage} alt="" fill priority className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-background via-transparent to-transparent" />
      <div className="asura-container relative flex min-h-[520px] items-center py-16">
        <div className="max-w-2xl">
          <div className="mb-4 flex flex-wrap gap-2">
            {comic.genres.map((genre) => (
              <Badge key={genre.id} className="bg-brand-primary/90 text-white">{genre.name}</Badge>
            ))}
          </div>
          <h1 className="text-balance text-4xl font-black tracking-tight text-white sm:text-6xl">{comic.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-brand-secondary">
            <span className="flex items-center gap-1 text-white"><Star className="h-4 w-4 fill-brand-gold text-brand-gold" /> {comic.avgRating.toFixed(1)} / 10</span>
            <span>{comic.chapterCount} Chapters</span>
            <span>{comic.status}</span>
          </div>
          <p className="mt-5 line-clamp-3 max-w-xl text-sm leading-6 text-brand-secondary sm:text-base">{comic.synopsis}</p>
          <Button asChild className="mt-7 bg-brand-primary px-6 text-white hover:bg-brand-light">
            <Link href={`/comics/${comic.slug}/chapter/${comic.chapters.at(-1)?.number ?? 1}`}>
              <Play className="mr-2 h-4 w-4 fill-white" /> Read Now
            </Link>
          </Button>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3">
        {comics.map((item, index) => (
          <button key={item.id} aria-label={`Show ${item.title}`} onClick={() => setActive(index)} className={cn("h-2.5 w-2.5 rounded-full bg-white/40", active === index && "w-8 bg-brand-primary")} />
        ))}
      </div>
      <Button aria-label="Previous featured comic" variant="ghost" size="icon" onClick={() => setActive((active - 1 + comics.length) % comics.length)} className="absolute left-4 top-1/2 hidden -translate-y-1/2 bg-black/35 hover:bg-brand-primary md:inline-flex">
        <ChevronLeft />
      </Button>
      <Button aria-label="Next featured comic" variant="ghost" size="icon" onClick={() => setActive((active + 1) % comics.length)} className="absolute right-4 top-1/2 hidden -translate-y-1/2 bg-black/35 hover:bg-brand-primary md:inline-flex">
        <ChevronRight />
      </Button>
    </section>
  );
}
