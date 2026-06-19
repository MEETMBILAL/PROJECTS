"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReaderBottomBarProps {
  slug: string;
  prevChapter: number | null;
  nextChapter: number | null;
  currentPage: number;
  totalPages: number;
  onSettingsOpen: () => void;
}

export function ReaderBottomBar({
  slug,
  prevChapter,
  nextChapter,
  currentPage,
  totalPages,
  onSettingsOpen,
}: ReaderBottomBarProps) {
  const progress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-t border-brand-surface/50">
      <div className="h-1 bg-brand-surface">
        <div
          className="h-full bg-brand-purple transition-all duration-150"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={currentPage}
          aria-valuemin={1}
          aria-valuemax={totalPages}
        />
      </div>
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {prevChapter ? (
          <Button asChild variant="ghost" size="sm">
            <Link href={`/comics/${slug}/chapter/${prevChapter}`}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Link>
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs text-brand-text-muted">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={onSettingsOpen}
            className="p-2 rounded-lg text-brand-text-secondary hover:text-white hover:bg-brand-card-hover transition-colors"
            aria-label="Reader settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>

        {nextChapter ? (
          <Button asChild variant="ghost" size="sm">
            <Link href={`/comics/${slug}/chapter/${nextChapter}`}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
