import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const payloadSchema = z.object({ comicId: z.string().optional(), slug: z.string().optional() });
const hasDatabase = Boolean(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('user:password'));

export async function POST(request: Request) {
  const session = await getServerSession(authOptions).catch(() => null);
  const payload = payloadSchema.parse(await request.json());
  if (!session?.user?.id || !hasDatabase) return NextResponse.json({ ok: true, optimistic: true });
  const comic = payload.comicId ? { id: payload.comicId } : await prisma.comic.findUnique({ where: { slug: payload.slug } });
  if (!comic) return NextResponse.json({ error: 'Comic not found' }, { status: 404 });
  const bookmark = await prisma.bookmark.upsert({
    where: { userId_comicId: { userId: session.user.id, comicId: comic.id } },
    update: {},
    create: { userId: session.user.id, comicId: comic.id },
  });
  return NextResponse.json({ item: bookmark });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions).catch(() => null);
  const payload = payloadSchema.parse(await request.json());
  if (!session?.user?.id || !hasDatabase) return NextResponse.json({ ok: true, optimistic: true });
  const comic = payload.comicId ? { id: payload.comicId } : await prisma.comic.findUnique({ where: { slug: payload.slug } });
  if (comic) await prisma.bookmark.deleteMany({ where: { userId: session.user.id, comicId: comic.id } });
  return NextResponse.json({ ok: true });
}
