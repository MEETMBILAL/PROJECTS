"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Settings, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useReaderStore } from "@/store";

interface ReaderControlsProps {
  comicTitle: string;
  comicSlug: string;
  currentChapter: number;
  chapters: { number: number; title: string | null }[];
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  progress: number;
  showSettings: boolean;
  onToggleSettings: () => void;
}

export function ReaderTopBar({
  comicTitle,
  comicSlug,
  currentChapter,
  chapters,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  onToggleSettings,
}: Omit<ReaderControlsProps, "progress" | "showSettings">) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-black/90 backdrop-blur-sm border-b border-brand-surface px-4 h-12">
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href={`/comics/${comicSlug}`}
          className="text-brand-secondary hover:text-white transition-colors shrink-0"
          aria-label="Back to comic"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="text-sm font-medium truncate hidden sm:block">
          {comicTitle}
        </span>
      </div>

      <Select
        value={currentChapter.toString()}
        onValueChange={(val) => {
          window.location.href = `/comics/${comicSlug}/chapter/${val}`;
        }}
      >
        <SelectTrigger className="w-40 h-8 text-xs bg-brand-card border-brand-surface">
          <SelectValue placeholder={`Ch. ${currentChapter}`} />
        </SelectTrigger>
        <SelectContent>
          {chapters.map((ch) => (
            <SelectItem key={ch.number} value={ch.number.toString()}>
              Ch. {ch.number} {ch.title ? `- ${ch.title}` : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrev}
          disabled={!hasPrev}
          aria-label="Previous chapter"
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          disabled={!hasNext}
          aria-label="Next chapter"
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSettings}
          aria-label="Reader settings"
          className="h-8 w-8"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function ReaderBottomBar({
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  progress,
  currentChapter,
}: Pick<
  ReaderControlsProps,
  "onPrev" | "onNext" | "hasPrev" | "hasNext" | "progress" | "currentChapter"
>) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-t border-brand-surface px-4 py-3">
      <div className="max-w-[800px] mx-auto">
        <Progress value={progress} className="mb-3" aria-label="Reading progress" />
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrev}
            disabled={!hasPrev}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          <span className="text-sm text-brand-secondary">
            Chapter {currentChapter}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNext}
            disabled={!hasNext}
            className="gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ReaderSettingsPanel() {
  const {
    imageQuality,
    backgroundColor,
    readingMode,
    setImageQuality,
    setBackgroundColor,
    setReadingMode,
  } = useReaderStore();

  return (
    <div className="fixed right-4 top-16 z-50 w-64 rounded-modal border border-brand-surface bg-brand-card p-4 shadow-lg">
      <h3 className="text-sm font-semibold mb-4">Reader Settings</h3>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-brand-secondary mb-2 block">
            Image Quality
          </label>
          <div className="flex gap-2">
            {(["low", "medium", "high"] as const).map((q) => (
              <button
                key={q}
                onClick={() => setImageQuality(q)}
                className={`flex-1 rounded-md py-1.5 text-xs capitalize transition-colors ${
                  imageQuality === q
                    ? "bg-brand-purple text-white"
                    : "bg-brand-surface text-brand-secondary hover:text-white"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-brand-secondary mb-2 block">
            Background
          </label>
          <div className="flex gap-2">
            {["#000000", "#1a1a1a", "#ffffff"].map((color) => (
              <button
                key={color}
                onClick={() => setBackgroundColor(color)}
                className={`h-8 w-8 rounded-md border-2 transition-all ${
                  backgroundColor === color
                    ? "border-brand-purple"
                    : "border-brand-surface"
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Background ${color}`}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-brand-secondary mb-2 block">
            Reading Mode
          </label>
          <div className="flex gap-2">
            {(["longstrip", "paginated"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setReadingMode(mode)}
                className={`flex-1 rounded-md py-1.5 text-xs capitalize transition-colors ${
                  readingMode === mode
                    ? "bg-brand-purple text-white"
                    : "bg-brand-surface text-brand-secondary hover:text-white"
                }`}
              >
                {mode === "longstrip" ? "Long Strip" : "Paginated"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
