import { notFound } from "next/navigation";

import { ReaderShell } from "@/components/reader-shell";
import { getChapter } from "@/lib/mock-data";

export function generateMetadata({ params }: { params: { slug: string; num: string } }) {
  const result = getChapter(params.slug, params.num);
  return {
    title: result ? `${result.comic.title} Chapter ${result.chapter.number}` : "Chapter Reader",
  };
}

export default function ChapterReaderPage({ params }: { params: { slug: string; num: string } }) {
  const result = getChapter(params.slug, params.num);
  if (!result) notFound();

  return <ReaderShell comic={result.comic} chapter={result.chapter} />;
}
