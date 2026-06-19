'use client';

import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/comics/star-rating';
import type { ComicDTO } from '@/lib/types';
import { cn } from '@/lib/utils';

export function HeroSlider({ comics }: { comics: ComicDTO[] }) {
  const [active, setActive] = useState(0);
  const comic = comics[active];

  useEffect(() => {
    const interval = window.setInterval(() => setActive((current) => (current + 1) % comics.length), 5000);
    return () => window.clearInterval(interval);
  }, [comics.length]);

  if (!comic) return null;
  const latest = comic.chapters[0];

  return (
    <section className="relative min-h-[520px] overflow-hidden border-b border-brand-surface bg-black md:min-h-[620px]" aria-label="Featured comics">
      <Image src={comic.bannerImage} alt="" fill priority sizes="100vw" className="object-cover opacity-70" />
      <div className="absolute inset-0 bg-hero-fade" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-dark to-transparent" />
      <div className="container relative z-10 flex min-h-[520px] items-center pt-[60px] md:min-h-[620px]">
        <div className="max-w-2xl space-y-5 py-16">
          <div className="flex flex-wrap gap-2">
            {comic.genres.slice(0, 4).map((genre) => <Badge key={genre} variant="outline">{genre}</Badge>)}
          </div>
          <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">{comic.title}</h1>
          <p className="line-clamp-3 max-w-xl text-base leading-7 text-brand-secondary md:text-lg">{comic.synopsis}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-brand-secondary">
            <StarRating rating={comic.avgRating} count={comic.ratingCount} />
            <span>{comic.chapters.length} Chapters</span>
            <span>{comic.type}</span>
          </div>
          <Button asChild size="lg">
            <Link href={`/comics/${comic.slug}/chapter/${latest?.number ?? 1}`}><Play className="h-5 w-5 fill-white" /> Read Now</Link>
          </Button>
        </div>
      </div>
      <div className="absolute bottom-8 right-4 z-20 flex items-center gap-3 md:right-10">
        <Button variant="secondary" size="icon" aria-label="Previous featured comic" onClick={() => setActive((active - 1 + comics.length) % comics.length)}><ChevronLeft className="h-5 w-5" /></Button>
        <div className="flex gap-2">
          {comics.map((item, index) => (
            <button key={item.id} onClick={() => setActive(index)} className={cn('h-2.5 rounded-full transition-all', index === active ? 'w-8 bg-brand-primary' : 'w-2.5 bg-white/35 hover:bg-white/70')} aria-label={`Show ${item.title}`} />
          ))}
        </div>
        <Button variant="secondary" size="icon" aria-label="Next featured comic" onClick={() => setActive((active + 1) % comics.length)}><ChevronRight className="h-5 w-5" /></Button>
      </div>
    </section>
  );
}
