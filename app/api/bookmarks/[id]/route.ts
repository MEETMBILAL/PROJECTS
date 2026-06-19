import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const hasDatabase = Boolean(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('user:password'));

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions).catch(() => null);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!hasDatabase) return NextResponse.json({ ok: true, optimistic: true });
  await prisma.bookmark.deleteMany({ where: { id: params.id, userId: session.user.id } });
  return NextResponse.json({ ok: true });
}
