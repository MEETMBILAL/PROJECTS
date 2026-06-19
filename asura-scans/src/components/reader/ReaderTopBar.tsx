"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReaderTopBarProps {
  slug: string;
  title: string;
  currentChapter: number;
  chapters: { number: number; title: string | null }[];
}

export function ReaderTopBar({
  slug,
  title,
  currentChapter,
  chapters,
}: ReaderTopBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-brand-surface/50">
      <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between gap-4">
        <Link
          href={`/comics/${slug}`}
          className="flex items-center gap-2 text-sm text-brand-text-secondary hover:text-white transition-colors flex-shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </Link>

        <h1 className="text-sm font-medium text-white truncate flex-1 text-center">
          {title}
        </h1>

        <Select
          value={currentChapter.toString()}
          onValueChange={(val) => {
            window.location.href = `/comics/${slug}/chapter/${val}`;
          }}
        >
          <SelectTrigger className="w-[140px] h-8 text-xs bg-brand-card border-brand-surface">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {chapters.map((ch) => (
              <SelectItem key={ch.number} value={ch.number.toString()}>
                Ch. {ch.number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
