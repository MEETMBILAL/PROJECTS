import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({ comicId: z.string(), chapterId: z.string().optional() });
const hasDatabase = Boolean(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('user:password'));

export async function POST(request: Request) {
  const session = await getServerSession(authOptions).catch(() => null);
  const payload = schema.parse(await request.json());
  if (!hasDatabase) return NextResponse.json({ ok: true, optimistic: true });
  await prisma.$transaction([
    prisma.view.create({ data: { comicId: payload.comicId, chapterId: payload.chapterId, userId: session?.user?.id } }),
    prisma.comic.update({ where: { id: payload.comicId }, data: { totalViews: { increment: 1 } } }),
    ...(payload.chapterId ? [prisma.chapter.update({ where: { id: payload.chapterId }, data: { views: { increment: 1 } } })] : []),
  ]);
  return NextResponse.json({ ok: true });
}
