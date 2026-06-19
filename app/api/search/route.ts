import { NextResponse } from 'next/server';
import { searchComicsIndex } from '@/lib/search';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') ?? '';
  const items = await searchComicsIndex(q);
  return NextResponse.json({ items, total: items.length });
}
