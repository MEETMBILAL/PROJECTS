import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getLeaderboard } from '@/lib/data';
import { compactNumber } from '@/lib/utils';

async function Ranking({ period }: { period: 'weekly' | 'monthly' | 'all-time' }) {
  const items = await getLeaderboard(period);
  return <div className="space-y-3">{items.map((comic) => <Link key={comic.id} href={`/comics/${comic.slug}`} className="focus-purple grid grid-cols-[44px_56px_1fr_auto] items-center gap-3 rounded-xl border border-brand-surface bg-brand-card p-3 transition-colors hover:bg-brand-cardHover"><div className="text-center text-xl font-black text-brand-accent">{comic.rank}</div><div className="relative aspect-[3/4] overflow-hidden rounded bg-brand-surface"><Image src={comic.coverImage} alt="" fill sizes="56px" className="object-cover" /></div><div className="min-w-0"><p className="truncate font-semibold text-white">{comic.title}</p><p className="text-sm text-brand-secondary">{comic.genres.slice(0, 3).join(', ')}</p></div><div className="text-right text-sm"><p className="font-bold text-white">{compactNumber(comic.periodViews)}</p><p className="flex justify-end text-xs text-brand-secondary">{comic.change > 0 ? <ArrowUp className="h-4 w-4 text-brand-new" /> : comic.change < 0 ? <ArrowDown className="h-4 w-4 text-brand-hot" /> : <Minus className="h-4 w-4" />}</p></div></Link>)}</div>;
}

export default function LeaderboardPage() {
  return (
    <main className="container pt-28">
      <h1 className="text-4xl font-black text-white">Leaderboard</h1>
      <p className="mt-2 text-brand-secondary">Most-read comics by weekly, monthly, and all-time views.</p>
      <Tabs defaultValue="weekly" className="mt-8"><TabsList><TabsTrigger value="weekly">Weekly</TabsTrigger><TabsTrigger value="monthly">Monthly</TabsTrigger><TabsTrigger value="all-time">All-time</TabsTrigger></TabsList><TabsContent value="weekly"><Ranking period="weekly" /></TabsContent><TabsContent value="monthly"><Ranking period="monthly" /></TabsContent><TabsContent value="all-time"><Ranking period="all-time" /></TabsContent></Tabs>
    </main>
  );
}
