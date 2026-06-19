"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Settings, List } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useReaderStore } from "@/stores";
import { cn } from "@/lib/utils";

interface ReaderControlsProps {
  slug: string;
  title: string;
  currentChapter: number;
  prevChapter: number | null;
  nextChapter: number | null;
  chapters: Array<{ number: number; title: string | null }>;
  progress: number;
  showSettings: boolean;
  onToggleSettings: () => void;
}

export function ReaderTopBar({
  slug,
  title,
  currentChapter,
  prevChapter,
  nextChapter,
  chapters,
  onToggleSettings,
}: Omit<ReaderControlsProps, "progress" | "showSettings">) {
  return (
    <header className="sticky top-0 z-50 flex h-12 items-center justify-between border-b border-brand-surface/50 bg-black/90 px-4 backdrop-blur-sm">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href={`/comics/${slug}`}
          className="shrink-0 text-brand-text-secondary transition-colors hover:text-brand-purple-light"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-brand-text-primary">{title}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={currentChapter.toString()}
          onValueChange={(val) => {
            window.location.href = `/comics/${slug}/chapter/${val}`;
          }}
        >
          <SelectTrigger className="h-8 w-[140px] border-brand-surface bg-brand-card text-xs">
            <SelectValue placeholder="Chapter" />
          </SelectTrigger>
          <SelectContent className="max-h-60 bg-brand-card border-brand-surface">
            {chapters.map((ch) => (
              <SelectItem key={ch.number} value={ch.number.toString()}>
                Ch. {ch.number}{ch.title ? `: ${ch.title}` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1">
          {prevChapter !== null ? (
            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
              <Link href={`/comics/${slug}/chapter/${prevChapter}`} aria-label="Previous chapter">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {nextChapter !== null ? (
            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
              <Link href={`/comics/${slug}/chapter/${nextChapter}`} aria-label="Next chapter">
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onToggleSettings}
          aria-label="Reader settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

export function ReaderBottomBar({
  slug,
  prevChapter,
  nextChapter,
  progress,
}: Pick<ReaderControlsProps, "slug" | "prevChapter" | "nextChapter" | "progress">) {
  return (
    <footer className="sticky bottom-0 z-50 border-t border-brand-surface/50 bg-black/90 px-4 py-3 backdrop-blur-sm">
      <div className="mx-auto max-w-[800px]">
        <div className="mb-2 h-1 overflow-hidden rounded-full bg-brand-surface">
          <div
            className="h-full bg-brand-purple transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className="flex items-center justify-between">
          {prevChapter !== null ? (
            <Link
              href={`/comics/${slug}/chapter/${prevChapter}`}
              className="flex items-center gap-1 text-sm text-brand-text-secondary hover:text-brand-purple-light"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Link>
          ) : (
            <span className="text-sm text-brand-muted">No previous</span>
          )}
          {nextChapter !== null ? (
            <Link
              href={`/comics/${slug}/chapter/${nextChapter}`}
              className="flex items-center gap-1 text-sm text-brand-text-secondary hover:text-brand-purple-light"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="text-sm text-brand-muted">No next</span>
          )}
        </div>
      </div>
    </footer>
  );
}

export function ReaderSettingsPanel({ open }: { open: boolean }) {
  const {
    imageQuality,
    backgroundColor,
    readingMode,
    setImageQuality,
    setBackgroundColor,
    setReadingMode,
  } = useReaderStore();

  if (!open) return null;

  return (
    <div className="fixed right-4 top-16 z-[60] w-64 rounded-modal border border-brand-surface bg-brand-card p-4 shadow-xl">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand-text-primary">
        <Settings className="h-4 w-4" /> Reader Settings
      </h3>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-xs text-brand-text-secondary">Image Quality</label>
          <div className="flex gap-2">
            {(["low", "medium", "high"] as const).map((q) => (
              <button
                key={q}
                onClick={() => setImageQuality(q)}
                className={cn(
                  "flex-1 rounded-md px-2 py-1 text-xs capitalize transition-colors",
                  imageQuality === q
                    ? "bg-brand-purple text-white"
                    : "bg-brand-surface text-brand-text-secondary hover:bg-brand-card-hover"
                )}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs text-brand-text-secondary">Background</label>
          <div className="flex gap-2">
            {["#000000", "#1A1A1A", "#FFFFFF"].map((color) => (
              <button
                key={color}
                onClick={() => setBackgroundColor(color)}
                className={cn(
                  "h-8 w-8 rounded-md border-2 transition-all",
                  backgroundColor === color ? "border-brand-purple" : "border-brand-surface"
                )}
                style={{ backgroundColor: color }}
                aria-label={`Background ${color}`}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs text-brand-text-secondary">Reading Mode</label>
          <div className="flex gap-2">
            <button
              onClick={() => setReadingMode("strip")}
              className={cn(
                "flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-2 text-xs transition-colors",
                readingMode === "strip"
                  ? "bg-brand-purple text-white"
                  : "bg-brand-surface text-brand-text-secondary"
              )}
            >
              <List className="h-3 w-3" /> Strip
            </button>
            <button
              onClick={() => setReadingMode("paginated")}
              className={cn(
                "flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-2 text-xs transition-colors",
                readingMode === "paginated"
                  ? "bg-brand-purple text-white"
                  : "bg-brand-surface text-brand-text-secondary"
              )}
            >
              Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
