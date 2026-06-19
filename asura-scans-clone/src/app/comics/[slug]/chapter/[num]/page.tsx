import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChapterReader } from "@/components/reader/chapter-reader";
import { getChapterForReader } from "@/lib/queries";
import { chapterLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string; num: string };
}): Promise<Metadata> {
  const number = Number(params.num);
  const data = await getChapterForReader(params.slug, number);
  if (!data) return { title: "Chapter not found" };
  return {
    title: `${data.comic.title} - ${chapterLabel(number)}`,
  };
}

export default async function ChapterReaderPage({
  params,
}: {
  params: { slug: string; num: string };
}) {
  const number = Number(params.num);
  if (Number.isNaN(number)) notFound();

  const data = await getChapterForReader(params.slug, number);
  if (!data) notFound();

  return (
    <ChapterReader
      comic={data.comic}
      chapter={data.chapter}
      chapters={data.chapters}
      prev={data.prev}
      next={data.next}
    />
  );
}
