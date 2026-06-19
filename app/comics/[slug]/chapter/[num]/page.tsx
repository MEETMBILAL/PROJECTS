import { notFound } from 'next/navigation';
import { ReaderShell } from '@/components/comics/reader-shell';
import { getChapter } from '@/lib/data';

export default async function ChapterReaderPage({ params }: { params: { slug: string; num: string } }) {
  const number = Number(params.num);
  if (!Number.isFinite(number)) notFound();
  const data = await getChapter(params.slug, number);
  if (!data) notFound();
  return <ReaderShell comic={data.comic} chapter={data.chapter} />;
}
