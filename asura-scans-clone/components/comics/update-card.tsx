import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/format";
import type { Comic } from "@/lib/types";
import { cn } from "@/lib/utils";

export function UpdateCard({ comic, badge }: { comic: Comic; badge?: "NEW" | "END" }) {
  return (
    <article className="group rounded-xl border border-brand-surface bg-brand-card p-2 transition duration-150 ease-in-out hover:scale-[1.03] hover:border-brand-primary hover:shadow-purple-soft">
      <div className="flex gap-3">
        <Link href={`/comics/${comic.slug}`} className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg">
          <Image src={comic.coverImage} alt={comic.title} fill sizes="96px" className="object-cover" />
          {badge ? <Badge className={cn("absolute left-2 top-2 border-none text-[10px]", badge === "NEW" ? "bg-brand-new" : "bg-brand-completed")}>{badge}</Badge> : null}
        </Link>
        <div className="min-w-0 flex-1 py-1">
          <Link href={`/comics/${comic.slug}`} className="line-clamp-2 text-sm font-bold text-white group-hover:text-brand-light">{comic.title}</Link>
          <div className="mt-3 grid gap-1.5">
            {comic.chapters.slice(0, 3).map((chapter) => (
              <Link
                key={chapter.id}
                href={`/comics/${comic.slug}/chapter/${chapter.number}`}
                className="flex items-center justify-between gap-2 rounded-md bg-black/20 px-2 py-1 text-xs text-brand-secondary hover:bg-brand-hover hover:text-white"
              >
                <span>Chapter {chapter.number}</span>
                <span className="shrink-0 text-brand-muted">{formatRelativeTime(chapter.publishedAt)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
