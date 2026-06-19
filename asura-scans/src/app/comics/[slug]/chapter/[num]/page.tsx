export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ChapterReader } from "@/components/reader/ChapterReader";

interface ChapterPageProps {
  params: { slug: string; num: string };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const chapterNum = parseFloat(params.num);
  if (isNaN(chapterNum)) notFound();

  const comic = await prisma.comic.findUnique({
    where: { slug: params.slug },
    include: {
      chapters: {
        orderBy: { number: "asc" },
        select: { id: true, number: true, title: true },
      },
    },
  });

  if (!comic) notFound();

  const chapter = comic.chapters.find((ch) => ch.number === chapterNum);
  if (!chapter) notFound();

  const chapterIndex = comic.chapters.findIndex((ch) => ch.number === chapterNum);
  const prevChapter =
    chapterIndex > 0 ? comic.chapters[chapterIndex - 1].number : null;
  const nextChapter =
    chapterIndex < comic.chapters.length - 1
      ? comic.chapters[chapterIndex + 1].number
      : null;

  return (
    <ChapterReader
      comicSlug={comic.slug}
      comicTitle={comic.title}
      chapterNumber={chapterNum}
      chapterId={chapter.id}
      chapters={comic.chapters}
      prevChapter={prevChapter}
      nextChapter={nextChapter}
      comicId={comic.id}
    />
  );
}

export async function generateMetadata({ params }: ChapterPageProps) {
  const comic = await prisma.comic.findUnique({ where: { slug: params.slug } });
  return {
    title: comic
      ? `${comic.title} - Chapter ${params.num}`
      : `Chapter ${params.num}`,
  };
}
