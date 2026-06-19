"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ReaderChrome } from "@/components/reader-chrome";
import { useReaderStore } from "@/store";

interface ChapterReaderProps {
  comicTitle: string;
  comicSlug: string;
  comicId: string;
  chapterId: string;
  currentChapter: number;
  chapters: { number: number; title: string | null }[];
  prevChapter: number | null;
  nextChapter: number | null;
  pages: { pageNum: number; imageUrl: string }[];
}

export function ChapterReader({
  comicTitle,
  comicSlug,
  comicId,
  chapterId,
  currentChapter,
  chapters,
  prevChapter,
  nextChapter,
  pages,
}: ChapterReaderProps) {
  const { backgroundColor, readingMode } = useReaderStore();
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comicId, chapterId }),
    }).catch(() => {});
  }, [comicId, chapterId]);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const scrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight - el.clientHeight;
    setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (!pages.length) {
    notFound();
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen overflow-y-auto"
      style={{ backgroundColor }}
    >
      <ReaderChrome
        comicTitle={comicTitle}
        comicSlug={comicSlug}
        currentChapter={currentChapter}
        chapters={chapters}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
        progress={progress}
      />

      <div className="pt-14 pb-12">
        <div
          className={`mx-auto max-w-[800px] ${
            readingMode === "paginated" ? "h-[calc(100vh-104px)] overflow-hidden flex items-center justify-center" : ""
          }`}
        >
          {pages.map((page) => (
            <div key={page.pageNum} className="relative w-full">
              <Image
                src={page.imageUrl}
                alt={`Page ${page.pageNum}`}
                width={800}
                height={1200}
                className="w-full h-auto"
                loading="lazy"
                sizes="800px"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
