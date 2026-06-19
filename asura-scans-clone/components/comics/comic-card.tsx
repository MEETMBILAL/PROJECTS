import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Comic } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ComicCard({ comic, rank, badge, compact = false }: { comic: Comic; rank?: number; badge?: "NEW" | "END" | "HOT"; compact?: boolean }) {
  const latest = comic.chapters[0];
  return (
    <Link href={`/comics/${comic.slug}`} className="group block focus-visible:rounded-lg" aria-label={`Open ${comic.title}`}>
      <article className="overflow-hidden rounded-lg border border-transparent bg-brand-card transition duration-150 ease-in-out group-hover:-translate-y-1 group-hover:border-brand-primary group-hover:shadow-purple-soft">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
          <Image
            src={comic.coverImage}
            alt={comic.title}
            fill
            sizes="(min-width:1280px) 16vw, (min-width:768px) 25vw, 50vw"
            className="object-cover transition duration-150 ease-in-out group-hover:scale-105"
          />
          <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 purple-gradient-hover" />
          {rank ? (
            <div className="absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-md bg-brand-primary text-sm font-black text-white shadow-lg">{rank}</div>
          ) : null}
          {badge ? (
            <Badge
              className={cn(
                "absolute right-2 top-2 border-none text-xs font-black",
                badge === "NEW" && "bg-brand-new text-white",
                badge === "END" && "bg-brand-completed text-white",
                badge === "HOT" && "bg-brand-hot text-white",
              )}
            >
              {badge}
            </Badge>
          ) : null}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/75 px-2 py-1 text-xs font-bold text-white">
            <Star className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" /> {comic.avgRating.toFixed(1)}
          </div>
        </div>
        <div className={cn("p-3", compact && "p-2")}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-white group-hover:text-brand-light">{comic.title}</h3>
          {latest ? <p className="mt-2 text-xs text-brand-secondary">Chapter {latest.number}</p> : null}
        </div>
      </article>
    </Link>
  );
}
