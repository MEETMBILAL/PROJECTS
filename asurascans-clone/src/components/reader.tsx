"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  List,
  Loader2,
  Settings2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useReaderStore,
  type ImageQuality,
  type ReaderBackground,
  type ReadingMode,
} from "@/store/use-reader-store";
import { useBookmarkStore } from "@/store/use-bookmark-store";
import type { Chapter } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ReaderProps {
  slug: string;
  comicTitle: string;
  chapterNumber: number;
  chapters: Chapter[];
}

const BG_CLASS: Record<ReaderBackground, string> = {
  black: "bg-black",
  dark: "bg-brand-bg",
  sepia: "bg-[#2b2417]",
};

export function Reader({ slug, comicTitle, chapterNumber, chapters }: ReaderProps) {
  const router = useRouter();
  const { mode, quality, background, setMode, setQuality, setBackground } =
    useReaderStore();
  const setLastRead = useBookmarkStore((s) => s.setLastRead);

  const [pages, setPages] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [current, setCurrent] = React.useState(0); // for paginated mode
  const [progress, setProgress] = React.useState(0);

  // Chapters sorted ascending for navigation
  const sorted = React.useMemo(
    () => [...chapters].sort((a, b) => a.number - b.number),
    [chapters]
  );
  const idx = sorted.findIndex((c) => c.number === chapterNumber);
  const prev = idx > 0 ? sorted[idx - 1] : null;
  const next = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;

  // Load pages
  React.useEffect(() => {
    let active = true;
    setLoading(true);
    setCurrent(0);
    const chapterId = `${slug}_ch_${chapterNumber}`;
    fetch(`/api/chapters/${encodeURIComponent(chapterId)}/pages`)
      .then((r) => r.json())
      .then((data) => {
        if (active) setPages(data.pages ?? []);
      })
      .catch(() => active && setPages([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug, chapterNumber]);

  // Record last-read + view
  React.useEffect(() => {
    setLastRead(slug, chapterNumber);
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    }).catch(() => {});
  }, [slug, chapterNumber, setLastRead]);

  const goPrev = React.useCallback(() => {
    if (prev) router.push(`/comics/${slug}/chapter/${prev.number}`);
  }, [prev, router, slug]);

  const goNext = React.useCallback(() => {
    if (next) router.push(`/comics/${slug}/chapter/${next.number}`);
  }, [next, router, slug]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (mode === "paginated") {
        if (e.key === "ArrowRight")
          setCurrent((c) => (c < pages.length - 1 ? c + 1 : (goNext(), c)));
        if (e.key === "ArrowLeft")
          setCurrent((c) => (c > 0 ? c - 1 : (goPrev(), c)));
      } else {
        if (e.key === "ArrowRight") goNext();
        if (e.key === "ArrowLeft") goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, mode, pages.length]);

  // Scroll progress (long-strip mode)
  React.useEffect(() => {
    if (mode !== "long-strip") return;
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode, pages]);

  React.useEffect(() => {
    if (mode === "paginated") {
      setProgress(pages.length ? ((current + 1) / pages.length) * 100 : 0);
    }
  }, [current, mode, pages.length]);

  return (
    <div className={cn("min-h-screen", BG_CLASS[background])}>
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between gap-2 px-3">
          <div className="flex min-w-0 items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
              <Link href={`/comics/${slug}`} aria-label="Back to comic">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <Link
              href={`/comics/${slug}`}
              className="truncate text-sm font-semibold text-white hover:text-brand-purple-light"
            >
              {comicTitle}
            </Link>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Chapter selector */}
            <select
              value={chapterNumber}
              onChange={(e) =>
                router.push(`/comics/${slug}/chapter/${e.target.value}`)
              }
              aria-label="Select chapter"
              className="h-8 rounded-md border border-white/15 bg-brand-card px-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
            >
              {[...sorted].reverse().map((c) => (
                <option key={c.id} value={c.number}>
                  Chapter {c.number}
                </option>
              ))}
            </select>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!prev}
              onClick={goPrev}
              aria-label="Previous chapter"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!next}
              onClick={goNext}
              aria-label="Next chapter"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <SettingsMenu
              mode={mode}
              quality={quality}
              background={background}
              onMode={setMode}
              onQuality={setQuality}
              onBackground={setBackground}
            />
          </div>
        </div>
        {/* progress bar */}
        <div className="h-0.5 w-full bg-white/10">
          <div
            className="h-full bg-brand-purple transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Pages */}
      <main className="mx-auto w-full max-w-[800px] px-0 sm:px-2">
        {loading ? (
          <div className="flex h-[70vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
          </div>
        ) : pages.length === 0 ? (
          <p className="py-20 text-center text-brand-text-secondary">
            No pages available for this chapter.
          </p>
        ) : mode === "long-strip" ? (
          <div className="flex flex-col">
            {pages.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={`Page ${i + 1}`}
                width={800}
                height={1200}
                sizes="(max-width: 800px) 100vw, 800px"
                loading={i < 2 ? "eager" : "lazy"}
                className="h-auto w-full"
              />
            ))}
          </div>
        ) : (
          <div className="relative flex min-h-[70vh] items-center justify-center">
            <Image
              src={pages[current]}
              alt={`Page ${current + 1}`}
              width={800}
              height={1200}
              priority
              className="h-auto w-full"
            />
            {/* tap zones */}
            <button
              className="absolute inset-y-0 left-0 w-1/2 cursor-w-resize"
              onClick={() =>
                setCurrent((c) => (c > 0 ? c - 1 : (goPrev(), c)))
              }
              aria-label="Previous page"
            />
            <button
              className="absolute inset-y-0 right-0 w-1/2 cursor-e-resize"
              onClick={() =>
                setCurrent((c) =>
                  c < pages.length - 1 ? c + 1 : (goNext(), c)
                )
              }
              aria-label="Next page"
            />
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
              {current + 1} / {pages.length}
            </span>
          </div>
        )}
      </main>

      {/* Bottom bar */}
      <footer className="sticky bottom-0 z-40 border-t border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-3">
          <Button variant="secondary" disabled={!prev} onClick={goPrev}>
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <div className="flex gap-1">
            <Button asChild variant="ghost" size="icon">
              <Link href={`/comics/${slug}`} aria-label="Chapter list">
                <List className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link href="/" aria-label="Home">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
          </div>
          <Button variant="secondary" disabled={!next} onClick={goNext}>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}

function SettingsMenu({
  mode,
  quality,
  background,
  onMode,
  onQuality,
  onBackground,
}: {
  mode: ReadingMode;
  quality: ImageQuality;
  background: ReaderBackground;
  onMode: (m: ReadingMode) => void;
  onQuality: (q: ImageQuality) => void;
  onBackground: (b: ReaderBackground) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Reader settings">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Reading mode</DropdownMenuLabel>
        {(["long-strip", "paginated"] as ReadingMode[]).map((m) => (
          <DropdownMenuItem key={m} onSelect={() => onMode(m)}>
            <span className={cn(mode === m && "text-brand-purple-light")}>
              {m === "long-strip" ? "Long strip" : "Paginated"}
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Image quality</DropdownMenuLabel>
        {(["auto", "high", "data-saver"] as ImageQuality[]).map((q) => (
          <DropdownMenuItem key={q} onSelect={() => onQuality(q)}>
            <span className={cn(quality === q && "text-brand-purple-light")}>
              {q === "data-saver" ? "Data saver" : q.charAt(0).toUpperCase() + q.slice(1)}
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Background</DropdownMenuLabel>
        {(["black", "dark", "sepia"] as ReaderBackground[]).map((b) => (
          <DropdownMenuItem key={b} onSelect={() => onBackground(b)}>
            <span className={cn(background === b && "text-brand-purple-light")}>
              {b.charAt(0).toUpperCase() + b.slice(1)}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
