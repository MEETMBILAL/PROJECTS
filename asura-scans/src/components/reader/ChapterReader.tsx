"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useReaderStore } from "@/stores/reader-store";
import { ReaderTopBar } from "@/components/reader/ReaderTopBar";
import { ReaderBottomBar } from "@/components/reader/ReaderBottomBar";
import { ReaderSettings } from "@/components/reader/ReaderSettings";
import { Skeleton } from "@/components/ui/skeleton";

interface ChapterReaderProps {
  slug: string;
  chapterNum: number;
  comic: {
    title: string;
    chapters: { number: number; title: string | null }[];
  };
  prevChapter: number | null;
  nextChapter: number | null;
  chapterId: string;
}

export function ChapterReader({
  slug,
  chapterNum,
  comic,
  prevChapter,
  nextChapter,
  chapterId,
}: ChapterReaderProps) {
  const { backgroundColor, readingMode } = useReaderStore();
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/chapters/${chapterId}/pages`)
      .then((res) => res.json())
      .then((data) => {
        setPages(data.pages ?? []);
        setCurrentPage(1);
      })
      .finally(() => setLoading(false));

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterId }),
    }).catch(() => {});
  }, [chapterId]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && prevChapter) {
        window.location.href = `/comics/${slug}/chapter/${prevChapter}`;
      }
      if (e.key === "ArrowRight" && nextChapter) {
        window.location.href = `/comics/${slug}/chapter/${nextChapter}`;
      }
    },
    [slug, prevChapter, nextChapter]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || readingMode !== "long-strip") return;

    const onScroll = () => {
      const images = container.querySelectorAll("img");
      let page = 1;
      images.forEach((img, i) => {
        const rect = img.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2) page = i + 1;
      });
      setCurrentPage(page);
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [pages, readingMode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-12 pb-16">
        <div className="max-w-[800px] mx-auto space-y-2 p-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="w-full aspect-[2/3] rounded-none" />
          ))}
        </div>
      </div>
    );
  }

  if (pages.length === 0) notFound();

  return (
    <div style={{ backgroundColor }} className="min-h-screen">
      <ReaderTopBar
        slug={slug}
        title={comic.title}
        currentChapter={chapterNum}
        chapters={comic.chapters}
      />

      <div
        ref={containerRef}
        className="pt-14 pb-16 max-w-[800px] mx-auto"
      >
        {readingMode === "long-strip" ? (
          pages.map((url, i) => (
            <Image
              key={i}
              src={url}
              alt={`Page ${i + 1}`}
              width={800}
              height={1200}
              className="w-full h-auto"
              loading="lazy"
              unoptimized
            />
          ))
        ) : (
          <Image
            src={pages[currentPage - 1]}
            alt={`Page ${currentPage}`}
            width={800}
            height={1200}
            className="w-full h-auto"
            priority
            unoptimized
          />
        )}
      </div>

      <ReaderBottomBar
        slug={slug}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
        currentPage={currentPage}
        totalPages={pages.length}
        onSettingsOpen={() => setSettingsOpen(true)}
      />

      <ReaderSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
