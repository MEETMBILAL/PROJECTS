import { NextResponse } from 'next/server';
import { getLatest } from '@/lib/data';

export async function GET() {
  return NextResponse.json({ items: await getLatest(24) });
}
