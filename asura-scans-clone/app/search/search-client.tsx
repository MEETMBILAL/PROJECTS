"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { searchComics } from "@/lib/mock-data";

export function SearchClient({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [debounced, setDebounced] = useState(initialQuery);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => searchComics(debounced), [debounced]);

  return (
    <div className="space-y-6">
      <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search comics" className="h-12 border-brand-surface bg-brand-card text-base" aria-label="Search comics" />
      {!debounced ? <p className="text-brand-secondary">Type to search the catalog.</p> : results.length ? (
        <div className="grid gap-3">
          {results.map((comic) => (
            <Link key={comic.id} href={`/comics/${comic.slug}`} className="flex gap-4 rounded-xl border border-brand-surface bg-brand-card p-3 hover:border-brand-primary hover:bg-brand-hover">
              <Image src={comic.coverImage} alt={comic.title} width={72} height={96} className="aspect-[3/4] rounded-md object-cover" />
              <div>
                <h2 className="font-bold text-white">{comic.title}</h2>
                <p className="mt-1 text-sm text-brand-secondary">Latest chapter {comic.chapters[0]?.number}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : <div className="rounded-xl border border-brand-surface bg-brand-card p-10 text-center text-brand-secondary">No results found.</div>}
    </div>
  );
}
