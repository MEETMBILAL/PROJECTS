import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Reader } from "@/components/reader";
import { getComicBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string; num: string };
}): Promise<Metadata> {
  const comic = await getComicBySlug(params.slug);
  if (!comic) return { title: "Not found" };
  return {
    title: `${comic.title} — Chapter ${params.num}`,
  };
}

export default async function ReaderPage({
  params,
}: {
  params: { slug: string; num: string };
}) {
  const comic = await getComicBySlug(params.slug);
  if (!comic) notFound();

  const chapterNumber = Number(params.num);
  const exists = comic.chapters.some((c) => c.number === chapterNumber);
  if (!Number.isFinite(chapterNumber) || !exists) notFound();

  return (
    <Reader
      slug={comic.slug}
      comicTitle={comic.title}
      chapterNumber={chapterNumber}
      chapters={comic.chapters}
    />
  );
}
