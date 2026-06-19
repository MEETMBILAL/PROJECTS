import { notFound } from "next/navigation";

import { ReaderShell } from "@/components/reader/reader-shell";
import { getChapter } from "@/lib/mock-data";

export function generateMetadata({ params }: { params: { slug: string; num: string } }) {
  const { comic } = getChapter(params.slug, params.num);
  return { title: comic ? `${comic.title} Chapter ${params.num}` : "Reader" };
}

export default function ChapterReaderPage({ params }: { params: { slug: string; num: string } }) {
  const { comic, chapter } = getChapter(params.slug, params.num);
  if (!comic || !chapter) notFound();
  return <ReaderShell comic={comic} chapter={chapter} />;
}
