"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  List,
  ScrollText,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReaderSettings } from "@/store/use-reader-settings";
import { cn, formatChapterNumber } from "@/lib/utils";

interface PageImage {
  id: string;
  index: number;
  imageUrl: string;
  width?: number | null;
  height?: number | null;
}

interface ReaderProps {
  slug: string;
  comicTitle: string;
  chapterNumber: number;
  chapterTitle?: string | null;
  pages: PageImage[];
  prevNumber: number | null;
  nextNumber: number | null;
  allChapters: { number: number; title: string | null }[];
}

export function Reader(props: ReaderProps) {
  const { slug, comicTitle, chapterNumber, pages, prevNumber, nextNumber, allChapters } = props;
  const router = useRouter();
  const { mode, background, maxWidth, quality, setMode, setBackground, setMaxWidth, setQuality } =
    useReaderSettings();

  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  const gotoChapter = React.useCallback(
    (num: number | null) => {
      if (num == null) return;
      router.push(`/comics/${slug}/chapter/${num}`);
    },
    [router, slug],
  );

  // Keyboard navigation
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft") {
        if (mode === "paginated" && pageIndex > 0) setPageIndex((i) => i - 1);
        else gotoChapter(prevNumber);
      } else if (e.key === "ArrowRight") {
        if (mode === "paginated" && pageIndex < pages.length - 1) setPageIndex((i) => i + 1);
        else gotoChapter(nextNumber);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, pageIndex, pages.length, prevNumber, nextNumber, gotoChapter]);

  // Scroll progress (long strip)
  React.useEffect(() => {
    if (mode !== "longstrip") return;
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode]);

  React.useEffect(() => {
    if (mode === "paginated") {
      setProgress(pages.length ? ((pageIndex + 1) / pages.length) * 100 : 0);
    }
  }, [mode, pageIndex, pages.length]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: background }}>
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 items-center gap-2">
            <Button asChild variant="ghost" size="icon" aria-label="Back to comic">
              <Link href={`/comics/${slug}`}>
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="min-w-0">
              <Link
                href={`/comics/${slug}`}
                className="block truncate text-sm font-semibold text-white hover:text-brand-purple-light"
              >
                {comicTitle}
              </Link>
              <span className="text-xs text-brand-text-muted">
                Chapter {formatChapterNumber(chapterNumber)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Previous chapter"
              disabled={prevNumber == null}
              onClick={() => gotoChapter(prevNumber)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Select
              value={String(chapterNumber)}
              onValueChange={(v) => gotoChapter(Number(v))}
            >
              <SelectTrigger className="h-9 w-36" aria-label="Select chapter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allChapters.map((c) => (
                  <SelectItem key={c.number} value={String(c.number)}>
                    Ch. {formatChapterNumber(c.number)}
                    {c.title ? ` — ${c.title}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Next chapter"
              disabled={nextNumber == null}
              onClick={() => gotoChapter(nextNumber)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            <Button asChild variant="ghost" size="icon" aria-label="Home">
              <Link href="/">
                <Home className="h-5 w-5" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Reader settings"
              onClick={() => setSettingsOpen((v) => !v)}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 w-full bg-white/10">
          <div
            className="h-full bg-brand-purple transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Settings panel */}
      {settingsOpen && (
        <div className="sticky top-14 z-20 border-b border-white/10 bg-brand-card/95 backdrop-blur">
          <div className="mx-auto grid max-w-5xl gap-4 px-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
            <SettingRow label="Reading mode">
              <div className="flex gap-2">
                <ModeButton active={mode === "longstrip"} onClick={() => setMode("longstrip")}>
                  <ScrollText className="h-4 w-4" /> Long strip
                </ModeButton>
                <ModeButton active={mode === "paginated"} onClick={() => setMode("paginated")}>
                  <BookOpen className="h-4 w-4" /> Paged
                </ModeButton>
              </div>
            </SettingRow>

            <SettingRow label="Image quality">
              <Select value={quality} onValueChange={(v) => setQuality(v as typeof quality)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low (data saver)</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>

            <SettingRow label="Background">
              <div className="flex gap-2">
                {["#000000", "#0F0F0F", "#1A1A1A", "#2b2b2b"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setBackground(c)}
                    aria-label={`Background ${c}`}
                    className={cn(
                      "h-8 w-8 rounded-md border-2",
                      background === c ? "border-brand-purple" : "border-white/20",
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </SettingRow>

            <SettingRow label="Container width">
              <input
                type="range"
                min={600}
                max={1200}
                step={50}
                value={maxWidth}
                onChange={(e) => setMaxWidth(Number(e.target.value))}
                className="w-full accent-brand-purple"
                aria-label="Container width"
              />
            </SettingRow>
          </div>
        </div>
      )}

      {/* Pages */}
      <div className="mx-auto w-full px-2 py-4" style={{ maxWidth }}>
        {pages.length === 0 ? (
          <p className="py-20 text-center text-brand-text-secondary">No pages available.</p>
        ) : mode === "longstrip" ? (
          <div className="flex flex-col items-center">
            {pages.map((p, i) => (
              <Image
                key={p.id}
                src={p.imageUrl}
                alt={`Page ${i + 1}`}
                width={p.width ?? 800}
                height={p.height ?? 1200}
                sizes="(max-width: 800px) 100vw, 800px"
                priority={i < 2}
                loading={i < 2 ? "eager" : "lazy"}
                className="h-auto w-full"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Image
              src={pages[pageIndex].imageUrl}
              alt={`Page ${pageIndex + 1}`}
              width={pages[pageIndex].width ?? 800}
              height={pages[pageIndex].height ?? 1200}
              priority
              className="h-auto w-full"
            />
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                disabled={pageIndex === 0}
                onClick={() => setPageIndex((i) => i - 1)}
              >
                <ChevronLeft className="h-4 w-4" /> Prev page
              </Button>
              <span className="text-sm text-brand-text-secondary">
                {pageIndex + 1} / {pages.length}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={pageIndex >= pages.length - 1}
                onClick={() => setPageIndex((i) => i + 1)}
              >
                Next page <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
          <Button
            variant="secondary"
            disabled={prevNumber == null}
            onClick={() => gotoChapter(prevNumber)}
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <Button asChild variant="ghost">
            <Link href={`/comics/${slug}`}>
              <List className="h-4 w-4" /> All chapters
            </Link>
          </Button>
          <Button disabled={nextNumber == null} onClick={() => gotoChapter(nextNumber)}>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-brand-text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-xs font-medium transition-colors",
        active
          ? "border-brand-purple bg-brand-purple/15 text-brand-purple-light"
          : "border-brand-surface text-brand-text-secondary hover:text-white",
      )}
    >
      {children}
    </button>
  );
}
