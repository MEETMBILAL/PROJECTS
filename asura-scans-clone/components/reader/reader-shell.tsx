"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Chapter, Comic } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ReaderShell({ comic, chapter }: { comic: Comic; chapter: Chapter }) {
  const router = useRouter();
  const [mode, setMode] = useState<"strip" | "paged">("strip");
  const [quality, setQuality] = useState("high");
  const [background, setBackground] = useState("black");
  const [page, setPage] = useState(0);
  const pages = chapter.pages ?? [];
  const sortedChapters = useMemo(() => [...comic.chapters].sort((a, b) => a.number - b.number), [comic.chapters]);
  const currentIndex = sortedChapters.findIndex((item) => item.number === chapter.number);
  const prev = sortedChapters[currentIndex - 1];
  const next = sortedChapters[currentIndex + 1];
  const progress = pages.length ? ((mode === "paged" ? page + 1 : pages.length) / pages.length) * 100 : 0;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft" && prev) router.push(`/comics/${comic.slug}/chapter/${prev.number}`);
      if (event.key === "ArrowRight" && next) router.push(`/comics/${comic.slug}/chapter/${next.number}`);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [comic.slug, next, prev, router]);

  return (
    <div className={cn("min-h-screen pb-24", background === "gray" ? "bg-brand-background" : "bg-black")}>
      <div className="sticky top-[60px] z-30 border-b border-brand-surface bg-black/90 backdrop-blur">
        <div className="asura-container flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
          <Link href={`/comics/${comic.slug}`} className="flex items-center gap-2 text-sm text-brand-secondary hover:text-white"><ArrowLeft className="h-4 w-4" /> {comic.title}</Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" disabled={!prev} aria-label="Previous chapter"><Link href={prev ? `/comics/${comic.slug}/chapter/${prev.number}` : "#"}><ChevronLeft /></Link></Button>
            <Select value={String(chapter.number)} onValueChange={(value) => router.push(`/comics/${comic.slug}/chapter/${value}`)}>
              <SelectTrigger className="w-[180px] border-brand-surface bg-brand-card"><SelectValue /></SelectTrigger>
              <SelectContent className="max-h-72 border-brand-surface bg-brand-card text-white">
                {comic.chapters.map((item) => <SelectItem key={item.id} value={String(item.number)}>Chapter {item.number}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button asChild variant="ghost" size="icon" disabled={!next} aria-label="Next chapter"><Link href={next ? `/comics/${comic.slug}/chapter/${next.number}` : "#"}><ChevronRight /></Link></Button>
          </div>
        </div>
      </div>

      <div className="asura-container py-4">
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-brand-surface bg-brand-card p-3 text-sm">
          <Button size="sm" variant={mode === "strip" ? "default" : "outline"} onClick={() => setMode("strip")} className={mode === "strip" ? "bg-brand-primary" : "border-brand-surface"}>Long strip</Button>
          <Button size="sm" variant={mode === "paged" ? "default" : "outline"} onClick={() => setMode("paged")} className={mode === "paged" ? "bg-brand-primary" : "border-brand-surface"}>Paginated</Button>
          <Settings className="h-4 w-4 text-brand-muted" />
          <Select value={quality} onValueChange={setQuality}>
            <SelectTrigger className="h-9 w-28 border-brand-surface bg-black"><SelectValue /></SelectTrigger>
            <SelectContent className="border-brand-surface bg-brand-card text-white"><SelectItem value="high">High</SelectItem><SelectItem value="data">Data saver</SelectItem></SelectContent>
          </Select>
          <Select value={background} onValueChange={setBackground}>
            <SelectTrigger className="h-9 w-32 border-brand-surface bg-black"><SelectValue /></SelectTrigger>
            <SelectContent className="border-brand-surface bg-brand-card text-white"><SelectItem value="black">Black bg</SelectItem><SelectItem value="gray">Dark bg</SelectItem></SelectContent>
          </Select>
        </div>

        <div className="mx-auto max-w-[800px]">
          {mode === "strip" ? pages.map((item) => (
            <Image key={item.id} src={item.imageUrl} alt={`Page ${item.pageNumber}`} width={item.width} height={item.height} loading="lazy" className="h-auto w-full" />
          )) : pages[page] ? (
            <button className="block w-full" onClick={() => setPage((value) => Math.min(value + 1, pages.length - 1))} aria-label="Next page">
              <Image src={pages[page].imageUrl} alt={`Page ${pages[page].pageNumber}`} width={pages[page].width} height={pages[page].height} priority className="h-auto w-full" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-surface bg-black/95 backdrop-blur">
        <div className="h-1 bg-brand-surface"><div className="h-full bg-brand-primary" style={{ width: `${progress}%` }} /></div>
        <div className="asura-container flex items-center justify-between gap-3 py-3">
          <Button asChild variant="outline" disabled={!prev} className="border-brand-surface"><Link href={prev ? `/comics/${comic.slug}/chapter/${prev.number}` : "#"}>Prev</Link></Button>
          <span className="text-xs text-brand-secondary">Chapter {chapter.number}</span>
          <Button asChild className="bg-brand-primary hover:bg-brand-light" disabled={!next}><Link href={next ? `/comics/${comic.slug}/chapter/${next.number}` : "#"}>Next</Link></Button>
        </div>
      </div>
    </div>
  );
}
