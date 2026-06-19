"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Settings,
  List,
  ScrollText,
  BookOpenCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, formatChapterNumber } from "@/lib/utils";
import { useReaderStore, type ReaderBg } from "@/store/reader";
import { useBookmarkStore } from "@/store/bookmarks";
import type { ChapterDTO, PageImageDTO } from "@/lib/types";

interface ReaderProps {
  slug: string;
  comicId: string;
  comicTitle: string;
  chapter: ChapterDTO;
  pages: PageImageDTO[];
  chapters: ChapterDTO[]; // newest first
}

const BG_OPTIONS: { value: ReaderBg; label: string }[] = [
  { value: "#000000", label: "Black" },
  { value: "#0F0F0F", label: "Charcoal" },
  { value: "#1A1A1A", label: "Slate" },
  { value: "#2A2A2A", label: "Gray" },
];

export function Reader({ slug, comicId, comicTitle, chapter, pages, chapters }: ReaderProps) {
  const router = useRouter();
  const { mode, setMode, background, setBackground, quality, setQuality } = useReaderStore();
  const setLastRead = useBookmarkStore((s) => s.setLastRead);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0); // for paginated mode
  const [progress, setProgress] = useState(0);
  const [chromeVisible, setChromeVisible] = useState(true);

  const sorted = useMemo(() => [...chapters].sort((a, b) => a.number - b.number), [chapters]);
  const currentIdx = sorted.findIndex((c) => c.number === chapter.number);
  const prevChapter = currentIdx > 0 ? sorted[currentIdx - 1] : null;
  const nextChapter =
    currentIdx >= 0 && currentIdx < sorted.length - 1 ? sorted[currentIdx + 1] : null;

  // Record reading progress in the bookmark store.
  useEffect(() => {
    setLastRead(slug, chapter.number);
    // Best-effort view tracking.
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comicId, chapterId: chapter.id }),
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, chapter.number]);

  const goToChapter = useCallback(
    (num: number) => {
      router.push(`/comics/${slug}/chapter/${num}`);
    },
    [router, slug],
  );

  // Keyboard navigation.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowLeft" && prevChapter) goToChapter(prevChapter.number);
      if (e.key === "ArrowRight" && nextChapter) goToChapter(nextChapter.number);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevChapter, nextChapter, goToChapter]);

  // Scroll progress (long strip).
  useEffect(() => {
    if (mode !== "longstrip") return;
    const onScroll = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (scrolled / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode]);

  useEffect(() => {
    if (mode === "paginated") {
      setProgress(pages.length ? ((pageIndex + 1) / pages.length) * 100 : 0);
    }
  }, [pageIndex, pages.length, mode]);

  // Reset to first page when chapter or mode changes.
  useEffect(() => setPageIndex(0), [chapter.number, mode]);

  const qualityWidth = quality === "high" ? 1000 : quality === "medium" ? 800 : 560;

  return (
    <div className="min-h-screen" style={{ backgroundColor: background }}>
      {/* Top bar */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-md transition-transform duration-200",
          !chromeVisible && "-translate-y-full",
        )}
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
          <Link
            href={`/comics/${slug}`}
            className="flex items-center gap-1 text-sm text-brand-text-secondary transition-colors hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <div className="min-w-0 flex-1 text-center">
            <Link
              href={`/comics/${slug}`}
              className="block truncate text-sm font-semibold text-white hover:text-brand-purple-light"
            >
              {comicTitle}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={String(chapter.number)}
              onValueChange={(v) => goToChapter(Number(v))}
            >
              <SelectTrigger className="h-9 w-[120px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {chapters.map((c) => (
                  <SelectItem key={c.id} value={String(c.number)}>
                    Chapter {formatChapterNumber(c.number)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Reader settings"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Pages */}
      <main
        className="mx-auto max-w-[800px] px-0 pb-24 pt-14"
        onClick={() => setChromeVisible((v) => !v)}
      >
        {mode === "longstrip" ? (
          <div className="flex flex-col">
            {pages.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={p.pageIndex}
                src={p.imageUrl}
                alt={`Page ${p.pageIndex + 1}`}
                width={qualityWidth}
                loading={p.pageIndex < 2 ? "eager" : "lazy"}
                className="mx-auto w-full"
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[80vh] flex-col items-center justify-center">
            {pages[pageIndex] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={pages[pageIndex].imageUrl}
                alt={`Page ${pageIndex + 1}`}
                width={qualityWidth}
                className="mx-auto w-full"
              />
            )}
            <div className="mt-4 flex items-center gap-4">
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  setPageIndex((i) => Math.max(0, i - 1));
                }}
                disabled={pageIndex === 0}
              >
                <ChevronLeft /> Prev page
              </Button>
              <span className="text-sm text-brand-text-secondary">
                {pageIndex + 1} / {pages.length}
              </span>
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  setPageIndex((i) => Math.min(pages.length - 1, i + 1));
                }}
                disabled={pageIndex >= pages.length - 1}
              >
                Next page <ChevronRight />
              </Button>
            </div>
          </div>
        )}

        {/* End-of-chapter nav */}
        <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3 px-4">
          {nextChapter ? (
            <Button asChild size="lg" className="w-full">
              <Link href={`/comics/${slug}/chapter/${nextChapter.number}`}>
                Next Chapter <ChevronRight />
              </Link>
            </Button>
          ) : (
            <p className="text-center text-sm text-brand-text-muted">
              You&apos;re all caught up on {comicTitle}.
            </p>
          )}
        </div>
      </main>

      {/* Bottom bar */}
      <footer
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/80 backdrop-blur-md transition-transform duration-200",
          !chromeVisible && "translate-y-full",
        )}
      >
        <div className="h-1 w-full bg-white/10">
          <div
            className="h-full bg-brand-purple transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
          <Button
            variant="ghost"
            disabled={!prevChapter}
            onClick={() => prevChapter && goToChapter(prevChapter.number)}
          >
            <ChevronLeft /> Prev
          </Button>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/comics/${slug}`}>
                <List className="h-4 w-4" /> Chapters
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMode(mode === "longstrip" ? "paginated" : "longstrip")}
            >
              {mode === "longstrip" ? (
                <>
                  <ScrollText className="h-4 w-4" /> Long Strip
                </>
              ) : (
                <>
                  <BookOpenCheck className="h-4 w-4" /> Paginated
                </>
              )}
            </Button>
          </div>

          <Button
            variant="ghost"
            disabled={!nextChapter}
            onClick={() => nextChapter && goToChapter(nextChapter.number)}
          >
            Next <ChevronRight />
          </Button>
        </div>
      </footer>

      {/* Settings panel */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reader Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-brand-text-secondary">Reading Mode</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={mode === "longstrip" ? "default" : "secondary"}
                  onClick={() => setMode("longstrip")}
                >
                  <ScrollText className="h-4 w-4" /> Long Strip
                </Button>
                <Button
                  variant={mode === "paginated" ? "default" : "secondary"}
                  onClick={() => setMode("paginated")}
                >
                  <BookOpenCheck className="h-4 w-4" /> Paginated
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-brand-text-secondary">Image Quality</p>
              <Select value={quality} onValueChange={(v) => setQuality(v as typeof quality)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low (data saver)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-brand-text-secondary">Background Color</p>
              <div className="flex gap-2">
                {BG_OPTIONS.map((bg) => (
                  <button
                    key={bg.value}
                    onClick={() => setBackground(bg.value)}
                    aria-label={bg.label}
                    className={cn(
                      "h-9 w-9 rounded-md border-2 transition-all",
                      background === bg.value
                        ? "border-brand-purple shadow-purple-glow"
                        : "border-brand-surface",
                    )}
                    style={{ backgroundColor: bg.value }}
                  />
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
