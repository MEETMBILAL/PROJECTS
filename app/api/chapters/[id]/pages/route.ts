import { NextResponse } from 'next/server';
import { MOCK_COMICS } from '@/lib/mock-data';
import { prisma } from '@/lib/prisma';

const hasDatabase = Boolean(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('user:password'));

export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (hasDatabase) {
    try {
      const pages = await prisma.chapterPage.findMany({ where: { chapterId: params.id }, orderBy: { pageNumber: 'asc' } });
      if (pages.length) return NextResponse.json({ items: pages });
    } catch {
      // fall through to mock lookup
    }
  }
  const chapter = MOCK_COMICS.flatMap((comic) => comic.chapters).find((item) => item.id === params.id);
  if (!chapter) return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
  return NextResponse.json({ items: chapter.pages });
}
