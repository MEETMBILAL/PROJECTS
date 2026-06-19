"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import type { Comic } from "@/lib/mock-data";

export function SearchPageClient({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = (await response.json()) as { results?: Comic[] };
        setResults(data.results ?? []);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [query]);

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-textMuted" />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title or genre..." className="h-12 pl-10 text-base" />
      </div>

      {loading && <p className="rounded-xl border border-brand-surface bg-brand-card p-6 text-center text-brand-textSecondary">Searching...</p>}
      {!loading && query.trim() && results.length === 0 && (
        <p className="rounded-xl border border-brand-surface bg-brand-card p-10 text-center text-brand-textSecondary">No results found.</p>
      )}
      <div className="grid gap-3">
        {results.map((comic) => (
          <Link key={comic.id} href={`/comics/${comic.slug}`} className="flex items-center gap-4 rounded-xl border border-brand-surface bg-brand-card p-3 hover:border-brand-primary hover:bg-brand-cardHover">
            <Image src={comic.coverImage} alt="" width={72} height={96} className="cover-aspect rounded-lg object-cover" />
            <div>
              <h2 className="font-black text-white">{comic.title}</h2>
              <p className="text-sm text-brand-textSecondary">Latest Chapter {comic.chapters[0]?.number ?? 1}</p>
              <p className="mt-1 text-xs text-brand-textMuted">{comic.genres.slice(0, 4).join(" • ")}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
