import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ChapterReader } from "@/components/reader/ChapterReader";

interface Props {
  params: { slug: string; num: string };
}

export const dynamic = "force-dynamic";

export default async function ChapterPage({ params }: Props) {
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
  }).catch(() => null);

  if (!comic) notFound();

  const chapter = comic.chapters.find((ch) => ch.number === chapterNum);
  if (!chapter) notFound();

  const chapterIndex = comic.chapters.findIndex((ch) => ch.number === chapterNum);
  const prevChapter = chapterIndex > 0 ? comic.chapters[chapterIndex - 1].number : null;
  const nextChapter =
    chapterIndex < comic.chapters.length - 1
      ? comic.chapters[chapterIndex + 1].number
      : null;

  return (
    <ChapterReader
      slug={params.slug}
      chapterNum={chapterNum}
      comic={{ title: comic.title, chapters: comic.chapters }}
      prevChapter={prevChapter}
      nextChapter={nextChapter}
      chapterId={chapter.id}
    />
  );
}
