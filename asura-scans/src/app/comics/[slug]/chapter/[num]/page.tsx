import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reader } from "@/components/reader/reader";
import { getComicBySlug, getChapter, getChapters } from "@/lib/data";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string; num: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const comic = await getComicBySlug(params.slug);
  if (!comic) return { title: "Not found" };
  return {
    title: `${comic.title} - Chapter ${params.num}`,
    description: `Read ${comic.title} Chapter ${params.num} online for free.`,
  };
}

export default async function ChapterReaderPage({ params }: PageProps) {
  const chapterNumber = Number(params.num);
  if (Number.isNaN(chapterNumber)) notFound();

  const comic = await getComicBySlug(params.slug);
  if (!comic) notFound();

  const [result, chapters] = await Promise.all([
    getChapter(params.slug, chapterNumber),
    getChapters(params.slug),
  ]);

  if (!result) notFound();

  return (
    <Reader
      slug={params.slug}
      comicId={comic.id}
      comicTitle={comic.title}
      chapter={result.chapter}
      pages={result.pages}
      chapters={chapters}
    />
  );
}
