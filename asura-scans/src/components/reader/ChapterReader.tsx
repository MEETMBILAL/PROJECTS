"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ReaderTopBar,
  ReaderBottomBar,
  ReaderSettingsPanel,
} from "@/components/reader/ReaderControls";
import { useReaderStore } from "@/store";
import { Skeleton } from "@/components/ui/skeleton";

interface ChapterReaderProps {
  comicSlug: string;
  comicTitle: string;
  chapterNumber: number;
  chapterId: string;
  chapters: { number: number; title: string | null }[];
  prevChapter: number | null;
  nextChapter: number | null;
  comicId: string;
}

export function ChapterReader({
  comicSlug,
  comicTitle,
  chapterNumber,
  chapterId,
  chapters,
  prevChapter,
  nextChapter,
  comicId,
}: ChapterReaderProps) {
  const router = useRouter();
  const { backgroundColor } = useReaderStore();
  const [pages, setPages] = useState<{ pageNum: number; imageUrl: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadPages() {
      setLoading(true);
      try {
        const res = await fetch(`/api/chapters/${chapterId}/pages`);
        const data = await res.json();
        setPages(data.data ?? []);
      } catch {
        setPages([]);
      } finally {
        setLoading(false);
      }
    }
    loadPages();
  }, [chapterId]);

  useEffect(() => {
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comicId, chapterId }),
    }).catch(() => {});
  }, [comicId, chapterId]);

  const goToChapter = useCallback(
    (num: number | null) => {
      if (num === null) return;
      router.push(`/comics/${comicSlug}/chapter/${num}`);
    },
    [router, comicSlug]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToChapter(prevChapter);
      if (e.key === "ArrowRight") goToChapter(nextChapter);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goToChapter, prevChapter, nextChapter]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [pages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Skeleton className="w-full max-w-[800px] h-[1200px]" />
      </div>
    );
  }

  if (pages.length === 0) notFound();

  return (
    <div className="min-h-screen" style={{ backgroundColor }}>
      <ReaderTopBar
        comicTitle={comicTitle}
        comicSlug={comicSlug}
        currentChapter={chapterNumber}
        chapters={chapters}
        onPrev={() => goToChapter(prevChapter)}
        onNext={() => goToChapter(nextChapter)}
        hasPrev={prevChapter !== null}
        hasNext={nextChapter !== null}
        onToggleSettings={() => setShowSettings(!showSettings)}
      />

      {showSettings && <ReaderSettingsPanel />}

      <div
        ref={containerRef}
        className="pt-14 pb-20 overflow-y-auto"
        style={{ height: "100vh" }}
      >
        <div className="mx-auto max-w-[800px]">
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

      <ReaderBottomBar
        onPrev={() => goToChapter(prevChapter)}
        onNext={() => goToChapter(nextChapter)}
        hasPrev={prevChapter !== null}
        hasNext={nextChapter !== null}
        progress={progress}
        currentChapter={chapterNumber}
      />
    </div>
  );
}
