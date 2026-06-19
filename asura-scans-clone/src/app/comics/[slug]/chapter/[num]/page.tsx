import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reader } from "@/components/reader/reader";
import { getChapterWithPages } from "@/lib/comics";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string; num: string };
}): Promise<Metadata> {
  return {
    title: `Chapter ${params.num}`,
  };
}

export default async function ChapterReaderPage({
  params,
}: {
  params: { slug: string; num: string };
}) {
  const number = Number(params.num);
  if (Number.isNaN(number)) notFound();

  const data = await getChapterWithPages(params.slug, number).catch(() => null);
  if (!data) notFound();

  const { comic, chapter, prevNumber, nextNumber, allChapters } = data;

  return (
    <Reader
      slug={comic.slug}
      comicTitle={comic.title}
      chapterNumber={chapter.number}
      chapterTitle={chapter.title}
      pages={chapter.pages}
      prevNumber={prevNumber}
      nextNumber={nextNumber}
      allChapters={allChapters}
    />
  );
}
