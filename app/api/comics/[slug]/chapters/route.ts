import { NextResponse } from 'next/server';
import { getComicBySlug } from '@/lib/data';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { searchParams } = new URL(request.url);
  const comic = await getComicBySlug(params.slug);
  if (!comic) return NextResponse.json({ error: 'Comic not found' }, { status: 404 });
  const q = searchParams.get('q')?.toLowerCase();
  const sort = searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest';
  const chapters = comic.chapters
    .filter((chapter) => (q ? `${chapter.number} ${chapter.title}`.toLowerCase().includes(q) : true))
    .sort((a, b) => (sort === 'oldest' ? a.number - b.number : b.number - a.number));
  return NextResponse.json({ items: chapters, total: chapters.length });
}
