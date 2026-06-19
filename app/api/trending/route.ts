import { NextResponse } from 'next/server';
import { getTrending } from '@/lib/data';

export async function GET() {
  return NextResponse.json({ items: await getTrending(10) });
}
