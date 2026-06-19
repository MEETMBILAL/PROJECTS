import { notFound } from "next/navigation";
import { ReaderClient } from "@/components/reader/reader-client";
import { getReaderData } from "@/lib/comics";

type ReaderPageProps = {
  params: {
    slug: string;
    num: string;
  };
};

export async function generateMetadata({ params }: ReaderPageProps) {
  const data = await getReaderData(params.slug, Number(params.num));
  return {
    title: data ? `${data.comic.title} Chapter ${data.chapter.number}` : "Chapter Reader",
    robots: {
      index: false,
      follow: false
    }
  };
}

export default async function ReaderPage({ params }: ReaderPageProps) {
  const data = await getReaderData(params.slug, Number(params.num));

  if (!data) {
    notFound();
  }

  return <ReaderClient comic={data.comic} chapter={data.chapter} chapters={data.chapters} pages={data.pages} />;
}
