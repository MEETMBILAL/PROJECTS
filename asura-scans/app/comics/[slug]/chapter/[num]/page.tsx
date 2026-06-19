import { ChapterReader } from "@/components/reader/ChapterReader";

interface ChapterPageProps {
  params: { slug: string; num: string };
}

export function generateMetadata({ params }: ChapterPageProps) {
  return {
    title: `Chapter ${params.num}`,
  };
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const chapterNum = parseFloat(params.num);
  if (isNaN(chapterNum)) {
    return <div className="p-8 text-center text-brand-text-secondary">Invalid chapter number</div>;
  }

  return <ChapterReader slug={params.slug} chapterNum={chapterNum} />;
}
