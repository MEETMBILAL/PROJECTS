"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useReaderStore } from "@/store/reader-store";
import type { Chapter, ChapterPage, Comic } from "@/types/comic";

type ReaderClientProps = {
  comic: Comic;
  chapter: Chapter;
  chapters: Chapter[];
  pages: ChapterPage[];
};

export function ReaderClient({ comic, chapter, chapters, pages }: ReaderClientProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { readingMode, background, imageQuality, currentPage, setReadingMode, setBackground, setImageQuality, setCurrentPage } =
    useReaderStore();

  const sortedChapters = useMemo(() => [...chapters].sort((a, b) => a.number - b.number), [chapters]);
  const index = sortedChapters.findIndex((item) => item.number === chapter.number);
  const previous = sortedChapters[index - 1];
  const next = sortedChapters[index + 1];
  const activePage = pages[currentPage] ?? pages[0];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && previous) {
        window.location.href = `/comics/${comic.slug}/chapter/${previous.number}`;
      }
      if (event.key === "ArrowRight" && next) {
        window.location.href = `/comics/${comic.slug}/chapter/${next.number}`;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [comic.slug, next, previous]);

  const backgroundClass =
    background === "paper" ? "bg-[#10100d]" : background === "charcoal" ? "bg-brand-background" : "bg-black";
  const progress = readingMode === "paginated" ? ((currentPage + 1) / pages.length) * 100 : 100;

  return (
    <div className={cn("min-h-screen text-white", backgroundClass)}>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/85 backdrop-blur">
        <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between gap-3 px-4">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/comics/${comic.slug}`}>
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back
            </Link>
          </Button>
          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-sm font-semibold">{comic.title}</p>
            <p className="text-xs text-brand-textMuted">Chapter {chapter.number}</p>
          </div>
          <Select
            value={String(chapter.number)}
            onChange={(event) => {
              window.location.href = `/comics/${comic.slug}/chapter/${event.target.value}`;
            }}
            aria-label="Select chapter"
            className="hidden w-36 sm:block"
          >
            {sortedChapters.map((item) => (
              <option key={item.id} value={item.number}>
                Ch. {item.number}
              </option>
            ))}
          </Select>
          <Button asChild variant="ghost" size="icon" aria-label="Previous chapter" className={!previous ? "pointer-events-none opacity-40" : ""}>
            <Link href={previous ? `/comics/${comic.slug}/chapter/${previous.number}` : "#"}>
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Next chapter" className={!next ? "pointer-events-none opacity-40" : ""}>
            <Link href={next ? `/comics/${comic.slug}/chapter/${next.number}` : "#"}>
              <ChevronRight className="h-5 w-5" aria-hidden />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setSettingsOpen((value) => !value)} aria-label="Reader settings">
            <Settings className="h-5 w-5" aria-hidden />
          </Button>
        </div>

        {settingsOpen && (
          <div className="border-t border-white/10 bg-brand-nav">
            <div className="mx-auto grid max-w-6xl gap-3 px-4 py-4 sm:grid-cols-3">
              <label className="grid gap-1 text-xs text-brand-textSecondary">
                Reading mode
                <Select value={readingMode} onChange={(event) => setReadingMode(event.target.value as "strip" | "paginated")}>
                  <option value="strip">Long strip</option>
                  <option value="paginated">Paginated</option>
                </Select>
              </label>
              <label className="grid gap-1 text-xs text-brand-textSecondary">
                Image quality
                <Select value={imageQuality} onChange={(event) => setImageQuality(event.target.value as "auto" | "high" | "data-saver")}>
                  <option value="auto">Auto</option>
                  <option value="high">High</option>
                  <option value="data-saver">Data saver</option>
                </Select>
              </label>
              <label className="grid gap-1 text-xs text-brand-textSecondary">
                Background
                <Select value={background} onChange={(event) => setBackground(event.target.value as "black" | "charcoal" | "paper")}>
                  <option value="black">Black</option>
                  <option value="charcoal">Charcoal</option>
                  <option value="paper">Warm dark</option>
                </Select>
              </label>
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto max-w-[800px] px-0 py-6 sm:px-4">
        {readingMode === "strip" ? (
          <div className="space-y-0">
            {pages.map((page) => (
              <Image
                key={page.id}
                src={page.imageUrl}
                alt={`Page ${page.pageIndex}`}
                width={page.width ?? 800}
                height={page.height ?? 1200}
                loading="lazy"
                className="h-auto w-full"
              />
            ))}
          </div>
        ) : activePage ? (
          <div className="space-y-4">
            <Image
              src={activePage.imageUrl}
              alt={`Page ${activePage.pageIndex}`}
              width={activePage.width ?? 800}
              height={activePage.height ?? 1200}
              priority
              className="h-auto w-full"
            />
            <div className="flex justify-between">
              <Button variant="secondary" disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>
                Previous page
              </Button>
              <Button
                variant="secondary"
                disabled={currentPage === pages.length - 1}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next page
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <footer className="sticky bottom-0 z-30 border-t border-white/10 bg-black/85 backdrop-blur">
        <div className="h-1 bg-brand-surface">
          <div className="h-full bg-brand-primary transition-all duration-150" style={{ width: `${progress}%` }} />
        </div>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Button asChild variant="secondary" className={!previous ? "pointer-events-none opacity-40" : ""}>
            <Link href={previous ? `/comics/${comic.slug}/chapter/${previous.number}` : "#"}>Previous Chapter</Link>
          </Button>
          <span className="text-xs text-brand-textMuted">
            {readingMode === "paginated" ? `Page ${currentPage + 1} / ${pages.length}` : `${pages.length} pages`}
          </span>
          <Button asChild className={!next ? "pointer-events-none opacity-40" : ""}>
            <Link href={next ? `/comics/${comic.slug}/chapter/${next.number}` : "#"}>Next Chapter</Link>
          </Button>
        </div>
      </footer>
    </div>
  );
}
