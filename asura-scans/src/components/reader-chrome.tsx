"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReaderStore } from "@/store";

interface ReaderChromeProps {
  comicTitle: string;
  comicSlug: string;
  currentChapter: number;
  chapters: { number: number; title: string | null }[];
  prevChapter: number | null;
  nextChapter: number | null;
  progress: number;
}

export function ReaderChrome({
  comicTitle,
  comicSlug,
  currentChapter,
  chapters,
  prevChapter,
  nextChapter,
  progress,
}: ReaderChromeProps) {
  const [showSettings, setShowSettings] = useState(false);
  const {
    imageQuality,
    readingMode,
    setImageQuality,
    setBackgroundColor,
    setReadingMode,
  } = useReaderStore();

  const navigate = useCallback(
    (chapter: number | null) => {
      if (chapter !== null) {
        window.location.href = `/comics/${comicSlug}/chapter/${chapter}`;
      }
    },
    [comicSlug]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && prevChapter !== null) navigate(prevChapter);
      if (e.key === "ArrowRight" && nextChapter !== null) navigate(nextChapter);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prevChapter, nextChapter, navigate]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-brand-surface">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/comics/${comicSlug}`}
              className="text-brand-text-secondary hover:text-white transition-colors flex items-center gap-1 text-sm"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <span className="text-white text-sm font-medium truncate">
              {comicTitle}
            </span>
          </div>

          <Select
            value={currentChapter.toString()}
            onValueChange={(v) => navigate(parseFloat(v))}
          >
            <SelectTrigger className="w-[160px] h-8 text-xs">
              <SelectValue placeholder="Chapter" />
            </SelectTrigger>
            <SelectContent>
              {chapters.map((ch) => (
                <SelectItem key={ch.number} value={ch.number.toString()}>
                  Ch. {ch.number}
                  {ch.title ? ` - ${ch.title}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              aria-label="Reader settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={prevChapter === null}
              onClick={() => navigate(prevChapter)}
              aria-label="Previous chapter"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={nextChapter === null}
              onClick={() => navigate(nextChapter)}
              aria-label="Next chapter"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {showSettings && (
        <div className="fixed top-14 right-4 z-50 w-72 bg-brand-card border border-brand-surface rounded-modal p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Settings</h3>
            <button onClick={() => setShowSettings(false)} aria-label="Close settings">
              <X className="h-4 w-4 text-brand-muted" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-brand-text-secondary block mb-1">
                Image Quality
              </label>
              <Select
                value={imageQuality}
                onValueChange={(v) =>
                  setImageQuality(v as "low" | "medium" | "high")
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-brand-text-secondary block mb-1">
                Background
              </label>
              <div className="flex gap-2">
                {["#000000", "#1A1A1A", "#FFFFFF"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setBackgroundColor(c)}
                    className="h-8 w-8 rounded border border-brand-surface"
                    style={{ backgroundColor: c }}
                    aria-label={`Background ${c}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-brand-text-secondary block mb-1">
                Reading Mode
              </label>
              <Select
                value={readingMode}
                onValueChange={(v) =>
                  setReadingMode(v as "strip" | "paginated")
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strip">Long Strip</SelectItem>
                  <SelectItem value="paginated">Paginated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-t border-brand-surface">
        <div className="h-1 bg-brand-surface">
          <div
            className="h-full bg-brand-purple transition-all"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className="container mx-auto px-4 h-12 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            disabled={prevChapter === null}
            onClick={() => navigate(prevChapter)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Prev
          </Button>
          <span className="text-sm text-brand-text-secondary">
            Chapter {currentChapter}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={nextChapter === null}
            onClick={() => navigate(nextChapter)}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </footer>
    </>
  );
}
