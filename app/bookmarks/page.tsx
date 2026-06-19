import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { ComicCard } from '@/components/comics/comic-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { authOptions } from '@/lib/auth';
import { getComics } from '@/lib/data';

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions).catch(() => null);
  const comics = (await getComics({ sort: 'latest', pageSize: 8 })).items;

  if (!session?.user) {
    return (
      <main className="container flex min-h-[70vh] flex-col items-center justify-center gap-4 pt-24 text-center">
        <h1 className="text-4xl font-black text-white">Your bookmarks</h1>
        <p className="max-w-lg text-brand-secondary">Sign in with email/password or Google OAuth to sync favorites and unread chapter counts.</p>
        <Button asChild><Link href="/api/auth/signin">Log in to continue</Link></Button>
      </main>
    );
  }

  return (
    <main className="container space-y-8 pt-28">
      <div><h1 className="text-4xl font-black text-white">Bookmarks</h1><p className="mt-2 text-brand-secondary">Continue where you left off. Demo unread badges use seeded/sample data.</p></div>
      {comics.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">{comics.map((comic, index) => <div key={comic.id} className="relative"><ComicCard comic={comic} /><Badge variant="hot" className="absolute right-2 top-2">{index + 1} unread</Badge></div>)}</div> : <div className="rounded-xl border border-brand-surface bg-brand-card p-10 text-center"><p className="text-brand-secondary">No bookmarks yet.</p><Button asChild className="mt-4"><Link href="/browse">Browse comics</Link></Button></div>}
    </main>
  );
}
