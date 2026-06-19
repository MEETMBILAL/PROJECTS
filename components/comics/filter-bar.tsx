use client';

import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GENRES } from '@/lib/mock-data';

const statuses = ['ONGOING', 'COMPLETED', 'HIATUS'];
const types = ['MANGA', 'MANHWA', 'MANHUA'];
const sorts = [
  ['latest', 'Latest'],
  ['az', 'A-Z'],
  ['rating', 'Rating'],
  ['views', 'Views'],
] as const;

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value?: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === 'all') params.delete(key);
    else params.set(key, value);
    params.delete('page');
    router.push(`/browse?${params.toString()}`);
  }

  const active = ['genre', 'status', 'type', 'sort'].map((key) => [key, searchParams.get(key)] as const).filter(([, value]) => value);

  return (
    <div className="sticky top-[60px] z-20 border-b border-brand-surface bg-brand-dark/95 py-4 backdrop-blur">
      <div className="container space-y-4">
        <div className="grid gap-3 md:grid-cols-4">
          <Select value={searchParams.get('genre') ?? 'all'} onValueChange={(value) => update('genre', value)}><SelectTrigger><SelectValue placeholder="Genre" /></SelectTrigger><SelectContent><SelectItem value="all">All genres</SelectItem>{GENRES.map((genre) => <SelectItem key={genre} value={genre}>{genre}</SelectItem>)}</SelectContent></Select>
          <Select value={searchParams.get('status') ?? 'all'} onValueChange={(value) => update('status', value)}><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">Any status</SelectItem>{statuses.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent></Select>
          <Select value={searchParams.get('type') ?? 'all'} onValueChange={(value) => update('type', value)}><SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger><SelectContent><SelectItem value="all">Any type</SelectItem>{types.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select>
          <Select value={searchParams.get('sort') ?? 'latest'} onValueChange={(value) => update('sort', value)}><SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger><SelectContent>{sorts.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select>
        </div>
        {active.length ? (
          <div className="flex flex-wrap gap-2">
            {active.map(([key, value]) => <Badge key={key} variant="outline" className="gap-1">{key}: {value}<button onClick={() => update(key)} aria-label={`Remove ${key} filter`}><X className="h-3 w-3" /></button></Badge>)}
            <Button variant="ghost" size="sm" onClick={() => router.push('/browse')}>Clear all</Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
