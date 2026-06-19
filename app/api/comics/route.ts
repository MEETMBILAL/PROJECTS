import { NextResponse } from 'next/server';
import { getComics } from '@/lib/data';
import type { ComicStatus, ComicType } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genres = searchParams.getAll('genre');
  const payload = await getComics({
    q: searchParams.get('q') ?? undefined,
    genres: genres.length ? genres : undefined,
    status: (searchParams.get('status') as ComicStatus | null) ?? undefined,
    type: (searchParams.get('type') as ComicType | null) ?? undefined,
    sort: (searchParams.get('sort') as 'latest' | 'az' | 'rating' | 'views' | null) ?? 'latest',
    page: Number(searchParams.get('page') ?? 1),
    pageSize: Number(searchParams.get('pageSize') ?? 24),
  });
  return NextResponse.json(payload);
}
