import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({ comicId: z.string(), value: z.number().int().min(1).max(10) });
const hasDatabase = Boolean(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('user:password'));

export async function POST(request: Request) {
  const session = await getServerSession(authOptions).catch(() => null);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = schema.parse(await request.json());
  if (!hasDatabase) return NextResponse.json({ ok: true, optimistic: true });
  const rating = await prisma.rating.upsert({
    where: { userId_comicId: { userId: session.user.id, comicId: payload.comicId } },
    update: { value: payload.value },
    create: { userId: session.user.id, comicId: payload.comicId, value: payload.value },
  });
  const aggregate = await prisma.rating.aggregate({ where: { comicId: payload.comicId }, _avg: { value: true }, _count: true });
  await prisma.comic.update({ where: { id: payload.comicId }, data: { avgRating: aggregate._avg.value ?? 0, ratingCount: aggregate._count } });
  return NextResponse.json({ item: rating });
}
