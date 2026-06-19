"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Chapter, Comic } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useReaderStore } from "@/store/use-reader-store";

export function ReaderShell({ comic, chapter }: { comic: Comic; chapter: Chapter }) {
  const router = useRouter();
  const { mode, pageIndex, background, quality, setMode, setPageIndex, setBackground, setQuality } = useReaderStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const sortedChapters = useMemo(() => [...comic.chapters].sort((a, b) => a.number - b.number), [comic.chapters]);
  const chapterIndex = sortedChapters.findIndex((item) => item.number === chapter.number);
  const previousChapter = sortedChapters[chapterIndex - 1];
  const nextChapter = sortedChapters[chapterIndex + 1];

  useEffect(() => {
    setPageIndex(0);
  }, [chapter.id, setPageIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && previousChapter) router.push(`/comics/${comic.slug}/chapter/${previousChapter.number}`);
      if (event.key === "ArrowRight" && nextChapter) router.push(`/comics/${comic.slug}/chapter/${nextChapter.number}`);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [comic.slug, nextChapter, previousChapter, router]);

  const progress = mode === "paginated" ? ((pageIndex + 1) / chapter.pages.length) * 100 : ((chapterIndex + 1) / sortedChapters.length) * 100;
  const pagesToRender = mode === "paginated" ? [chapter.pages[pageIndex]] : chapter.pages;

  return (
    <div className={cn("min-h-screen text-white", `reader-bg-${background}`)}>
      <div className="sticky top-0 z-30 border-b border-white/10 bg-black/85 backdrop-blur">
        <div className="container-shell flex min-h-[60px] flex-wrap items-center justify-between gap-3 py-2">
          <div className="flex min-w-0 items-center gap-3">
            <Button asChild variant="ghost" size="icon" aria-label="Back to comic">
              <Link href={`/comics/${comic.slug}`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{comic.title}</p>
              <p className="text-xs text-brand-textSecondary">Chapter {chapter.number}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="secondary" size="icon" aria-label="Previous chapter" className={!previousChapter ? "pointer-events-none opacity-40" : ""}>
              <Link href={previousChapter ? `/comics/${comic.slug}/chapter/${previousChapter.number}` : "#"}>
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <select
              value={chapter.number}
              onChange={(event) => router.push(`/comics/${comic.slug}/chapter/${event.target.value}`)}
              className="h-10 rounded-md border border-brand-surface bg-brand-card px-3 text-sm"
              aria-label="Select chapter"
            >
              {sortedChapters.map((item) => (
                <option key={item.id} value={item.number}>
                  Chapter {item.number}
                </option>
              ))}
            </select>
            <Button asChild variant="secondary" size="icon" aria-label="Next chapter" className={!nextChapter ? "pointer-events-none opacity-40" : ""}>
              <Link href={nextChapter ? `/comics/${comic.slug}/chapter/${nextChapter.number}` : "#"}>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setSettingsOpen((open) => !open)} aria-label="Reader settings">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="h-1 bg-brand-surface">
          <div className="h-full bg-brand-primary" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {settingsOpen && (
        <div className="container-shell py-4">
          <div className="ml-auto grid max-w-xl gap-3 rounded-xl border border-brand-surface bg-brand-card p-4 md:grid-cols-3">
            <label className="text-sm text-brand-textSecondary">
              Mode
              <select value={mode} onChange={(event) => setMode(event.target.value as "strip" | "paginated")} className="mt-1 h-10 w-full rounded-md bg-brand-background px-3 text-white">
                <option value="strip">Long strip</option>
                <option value="paginated">Paginated</option>
              </select>
            </label>
            <label className="text-sm text-brand-textSecondary">
              Quality
              <select value={quality} onChange={(event) => setQuality(event.target.value as "auto" | "high" | "data-saver")} className="mt-1 h-10 w-full rounded-md bg-brand-background px-3 text-white">
                <option value="auto">Auto</option>
                <option value="high">High</option>
                <option value="data-saver">Data saver</option>
              </select>
            </label>
            <label className="text-sm text-brand-textSecondary">
              Background
              <select value={background} onChange={(event) => setBackground(event.target.value as "black" | "charcoal" | "paper")} className="mt-1 h-10 w-full rounded-md bg-brand-background px-3 text-white">
                <option value="black">Black</option>
                <option value="charcoal">Charcoal</option>
                <option value="paper">Warm dark</option>
              </select>
            </label>
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-[800px] flex-col items-center py-4">
        {pagesToRender.map((page) =>
          page ? (
            <Image
              key={page.id}
              src={page.imageUrl}
              alt={`${comic.title} chapter ${chapter.number} page ${page.pageNumber}`}
              width={page.width}
              height={page.height}
              sizes="(max-width: 840px) 100vw, 800px"
              loading={page.pageNumber <= 2 ? "eager" : "lazy"}
              className="h-auto w-full"
            />
          ) : null,
        )}
      </div>

      {mode === "paginated" && (
        <div className="container-shell flex justify-center gap-3 pb-6">
          <Button variant="secondary" disabled={pageIndex === 0} onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}>
            Previous page
          </Button>
          <Button variant="secondary" disabled={pageIndex >= chapter.pages.length - 1} onClick={() => setPageIndex(Math.min(chapter.pages.length - 1, pageIndex + 1))}>
            Next page
          </Button>
        </div>
      )}

      <div className="sticky bottom-0 border-t border-white/10 bg-black/85 backdrop-blur">
        <div className="container-shell flex items-center justify-between py-3">
          <Button asChild variant="outline" className={!previousChapter ? "pointer-events-none opacity-40" : ""}>
            <Link href={previousChapter ? `/comics/${comic.slug}/chapter/${previousChapter.number}` : "#"}>Previous</Link>
          </Button>
          <span className="text-xs text-brand-textSecondary">{Math.round(progress)}% complete</span>
          <Button asChild className={!nextChapter ? "pointer-events-none opacity-40" : ""}>
            <Link href={nextChapter ? `/comics/${comic.slug}/chapter/${nextChapter.number}` : "#"}>Next</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
