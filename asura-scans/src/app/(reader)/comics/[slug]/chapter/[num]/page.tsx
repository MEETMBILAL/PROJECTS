import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ChapterReader } from "@/components/chapter-reader";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string; num: string };
}

export default async function ChapterPage({ params }: Props) {
  const chapterNum = parseFloat(params.num);
  if (isNaN(chapterNum)) notFound();

  const comic = await prisma.comic.findUnique({
    where: { slug: params.slug },
    include: {
      chapters: {
        orderBy: { number: "asc" },
        include: { pages: { orderBy: { pageNum: "asc" } } },
      },
    },
  });

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
      comicTitle={comic.title}
      comicSlug={comic.slug}
      comicId={comic.id}
      chapterId={chapter.id}
      currentChapter={chapterNum}
      chapters={comic.chapters.map((ch) => ({
        number: ch.number,
        title: ch.title,
      }))}
      prevChapter={prevChapter}
      nextChapter={nextChapter}
      pages={chapter.pages.map((p) => ({
        pageNum: p.pageNum,
        imageUrl: p.imageUrl,
      }))}
    />
  );
}
