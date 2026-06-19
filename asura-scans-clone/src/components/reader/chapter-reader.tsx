"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Settings,
  List,
  X,
} from "lucide-react";
import { cn, chapterLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useReaderStore } from "@/store/reader-store";
import { ViewTracker } from "@/components/comics/view-tracker";
import type { ChapterPageData } from "@/types";

interface ReaderProps {
  comic: { id: string; slug: string; title: string };
  chapter: { id: string; number: number; title: string | null; pages: ChapterPageData[] };
  chapters: { number: number; title: string | null }[];
  prev: number | null;
  next: number | null;
}

export function ChapterReader({ comic, chapter, chapters, prev, next }: ReaderProps) {
  const router = useRouter();
  const { mode, background, maxWidth, setMode } = useReaderStore();
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [chapterMenuOpen, setChapterMenuOpen] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [pageIndex, setPageIndex] = React.useState(0);

  const prevHref = prev !== null ? `/comics/${comic.slug}/chapter/${prev}` : null;
  const nextHref = next !== null ? `/comics/${comic.slug}/chapter/${next}` : null;

  // Keyboard navigation
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowLeft" && prevHref) router.push(prevHref);
      if (e.key === "ArrowRight" && nextHref) router.push(nextHref);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevHref, nextHref, router]);

  // Reading progress (long-strip)
  React.useEffect(() => {
    if (mode !== "long-strip") return;
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode]);

  const pages = chapter.pages;
  const paginatedProgress =
    pages.length > 1 ? (pageIndex / (pages.length - 1)) * 100 : 100;

  return (
    <div className="min-h-screen" style={{ background }}>
      <ViewTracker comicId={comic.id} chapterId={chapter.id} />

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4">
          <Link
            href={`/comics/${comic.slug}`}
            className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden truncate sm:inline">{comic.title}</span>
          </Link>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              disabled={!prevHref}
              onClick={() => prevHref && router.push(prevHref)}
              aria-label="Previous chapter"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="relative">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setChapterMenuOpen((o) => !o)}
                className="gap-2"
              >
                <List className="h-4 w-4" />
                {chapterLabel(chapter.number)}
              </Button>
              {chapterMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setChapterMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-20 mt-2 max-h-80 w-64 overflow-y-auto rounded-lg border border-brand-surface bg-brand-card p-1 shadow-lg scrollbar-thin">
                    {chapters
                      .slice()
                      .reverse()
                      .map((c) => (
                        <Link
                          key={c.number}
                          href={`/comics/${comic.slug}/chapter/${c.number}`}
                          onClick={() => setChapterMenuOpen(false)}
                          className={cn(
                            "block truncate rounded-md px-3 py-2 text-sm transition-colors hover:bg-brand-card-hover",
                            c.number === chapter.number
                              ? "bg-brand-purple/20 text-brand-purple-light"
                              : "text-brand-text-secondary"
                          )}
                        >
                          {chapterLabel(c.number, c.title)}
                        </Link>
                      ))}
                  </div>
                </>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              disabled={!nextHref}
              onClick={() => nextHref && router.push(nextHref)}
              aria-label="Next chapter"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen((o) => !o)}
              aria-label="Reader settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* progress bar */}
        <div className="h-0.5 w-full bg-white/10">
          <div
            className="h-full bg-brand-purple transition-all duration-150"
            style={{ width: `${mode === "long-strip" ? progress : paginatedProgress}%` }}
          />
        </div>
      </header>

      {settingsOpen && (
        <SettingsPanel onClose={() => setSettingsOpen(false)} />
      )}

      {/* Pages */}
      <div
        className="mx-auto w-full px-2 py-4"
        style={{ maxWidth: `${maxWidth}px` }}
      >
        {pages.length === 0 ? (
          <p className="py-20 text-center text-white/60">
            No pages available for this chapter.
          </p>
        ) : mode === "long-strip" ? (
          <div className="flex flex-col items-center">
            {pages.map((p, i) => (
              <Image
                key={p.id}
                src={p.imageUrl}
                alt={`Page ${p.pageNumber}`}
                width={p.width ?? 800}
                height={p.height ?? 1200}
                className="h-auto w-full"
                loading={i < 2 ? "eager" : "lazy"}
                priority={i === 0}
                sizes="(max-width: 800px) 100vw, 800px"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {pages[pageIndex] && (
              <Image
                src={pages[pageIndex].imageUrl}
                alt={`Page ${pages[pageIndex].pageNumber}`}
                width={pages[pageIndex].width ?? 800}
                height={pages[pageIndex].height ?? 1200}
                className="h-auto w-full"
                priority
                sizes="(max-width: 800px) 100vw, 800px"
              />
            )}
            <div className="flex items-center gap-3 text-white">
              <Button
                variant="secondary"
                size="sm"
                disabled={pageIndex === 0}
                onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
              >
                <ChevronLeft className="h-4 w-4" /> Prev page
              </Button>
              <span className="text-sm text-white/70">
                {pageIndex + 1} / {pages.length}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={pageIndex === pages.length - 1}
                onClick={() => setPageIndex((i) => Math.min(pages.length - 1, i + 1))}
              >
                Next page <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <footer className="border-t border-white/10 bg-black/80 py-6 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4">
          {prevHref ? (
            <Button asChild variant="secondary">
              <Link href={prevHref}>
                <ChevronLeft className="h-4 w-4" /> Previous Chapter
              </Link>
            </Button>
          ) : (
            <span />
          )}
          <Button asChild variant="ghost">
            <Link href={`/comics/${comic.slug}`}>All Chapters</Link>
          </Button>
          {nextHref ? (
            <Button asChild>
              <Link href={nextHref}>
                Next Chapter <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <span className="text-sm text-white/50">You&apos;re all caught up!</span>
          )}
        </div>
      </footer>
    </div>
  );
}

function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { mode, quality, background, maxWidth, setMode, setQuality, setBackground, setMaxWidth } =
    useReaderStore();

  const bgOptions = [
    { value: "#000000", label: "Black" },
    { value: "#0F0F0F", label: "Dark" },
    { value: "#1A1A1A", label: "Gray" },
    { value: "#FFFFFF", label: "White" },
  ];

  return (
    <div className="fixed right-4 top-16 z-40 w-72 rounded-lg border border-brand-surface bg-brand-card p-4 shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Reader Settings</h3>
        <button onClick={onClose} aria-label="Close settings" className="text-brand-text-muted hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-brand-text-secondary">
            Reading mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["long-strip", "paginated"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-md border px-2 py-1.5 text-xs capitalize transition-colors",
                  mode === m
                    ? "border-brand-purple bg-brand-purple/20 text-brand-purple-light"
                    : "border-brand-surface text-brand-text-secondary hover:bg-brand-card-hover"
                )}
              >
                {m.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-brand-text-secondary">
            Image quality
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["high", "medium", "low"] as const).map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={cn(
                  "rounded-md border px-2 py-1.5 text-xs capitalize transition-colors",
                  quality === q
                    ? "border-brand-purple bg-brand-purple/20 text-brand-purple-light"
                    : "border-brand-surface text-brand-text-secondary hover:bg-brand-card-hover"
                )}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-brand-text-secondary">
            Background
          </label>
          <div className="flex gap-2">
            {bgOptions.map((b) => (
              <button
                key={b.value}
                onClick={() => setBackground(b.value)}
                aria-label={b.label}
                className={cn(
                  "h-8 w-8 rounded-md border-2 transition-transform hover:scale-105",
                  background === b.value ? "border-brand-purple" : "border-brand-surface"
                )}
                style={{ background: b.value }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-brand-text-secondary">
            Page width: {maxWidth}px
          </label>
          <input
            type="range"
            min={500}
            max={1200}
            step={50}
            value={maxWidth}
            onChange={(e) => setMaxWidth(Number(e.target.value))}
            className="w-full accent-brand-purple"
          />
        </div>
      </div>
    </div>
  );
}
