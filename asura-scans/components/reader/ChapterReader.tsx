"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { useReaderStore } from "@/stores";
import {
  ReaderTopBar,
  ReaderBottomBar,
  ReaderSettingsPanel,
} from "@/components/reader/ReaderControls";

interface ChapterReaderProps {
  slug: string;
  chapterNum: number;
}

interface ChapterData {
  chapter: {
    id: string;
    number: number;
    title: string | null;
    pages: Array<{ id: string; pageNum: number; imageUrl: string }>;
    comic: { id: string; slug: string; title: string; coverImage: string };
  };
  prev: number | null;
  next: number | null;
  allChapters: Array<{ number: number; title: string | null }>;
}

export function ChapterReader({ slug, chapterNum }: ChapterReaderProps) {
  const [data, setData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { backgroundColor, readingMode, imageQuality } = useReaderStore();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/comics/${slug}/chapters?number=${chapterNum}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const json = await res.json();
        setData(json);

        await fetch("/api/views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            comicId: json.chapter.comic.id,
            chapterId: json.chapter.id,
          }),
        });
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, chapterNum]);

  const navigate = useCallback(
    (dir: "prev" | "next") => {
      if (!data) return;
      const target = dir === "prev" ? data.prev : data.next;
      if (target !== null) {
        window.location.href = `/comics/${slug}/chapter/${target}`;
      }
    },
    [data, slug]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") navigate("prev");
      if (e.key === "ArrowRight") navigate("next");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const pct = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setProgress(Math.min(100, Math.max(0, pct)));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [data]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-purple border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-brand-text-secondary">
        <p className="mb-4">Chapter not found</p>
        <a href={`/comics/${slug}`} className="text-brand-purple-light hover:underline">
          Back to comic
        </a>
      </div>
    );
  }

  const { chapter, prev, next, allChapters } = data;
  const qualityWidth = imageQuality === "low" ? 600 : imageQuality === "medium" ? 800 : 1200;

  return (
    <div className="min-h-screen" style={{ backgroundColor }}>
      <ReaderTopBar
        slug={slug}
        title={chapter.comic.title}
        currentChapter={chapter.number}
        prevChapter={prev}
        nextChapter={next}
        chapters={allChapters}
        onToggleSettings={() => setShowSettings(!showSettings)}
      />

      <ReaderSettingsPanel open={showSettings} />

      <div ref={containerRef} className="mx-auto max-w-[800px] px-2 py-4">
        {readingMode === "strip" ? (
          <div className="flex flex-col gap-0">
            {chapter.pages.map((page) => (
              <div key={page.id} className="relative w-full">
                <Image
                  src={page.imageUrl.replace(/\/\d+\/\d+$/, `/${qualityWidth}/${Math.round(qualityWidth * 1.5)}`)}
                  alt={`Page ${page.pageNum}`}
                  width={qualityWidth}
                  height={Math.round(qualityWidth * 1.5)}
                  className="h-auto w-full"
                  loading="lazy"
                  sizes="800px"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {chapter.pages.map((page) => (
              <div key={page.id} className="relative w-full max-h-[90vh] overflow-hidden">
                <Image
                  src={page.imageUrl}
                  alt={`Page ${page.pageNum}`}
                  width={qualityWidth}
                  height={Math.round(qualityWidth * 1.5)}
                  className="mx-auto h-auto max-h-[90vh] w-auto object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <ReaderBottomBar
        slug={slug}
        prevChapter={prev}
        nextChapter={next}
        progress={progress}
      />
    </div>
  );
}
