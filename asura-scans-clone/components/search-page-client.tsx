"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import type { Comic } from "@/types/comic";

export function SearchPageClient({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, { signal: controller.signal });
        const data = (await response.json()) as { items: Comic[] };
        setResults(data.items);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [query]);

  return (
    <div className="space-y-6">
      <label className="relative block">
        <span className="sr-only">Search comics</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-textMuted" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search comics..."
          className="h-12 pl-12 text-base"
        />
      </label>

      <Card className="overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-brand-textSecondary">Searching...</p>
        ) : results.length ? (
          results.map((comic) => (
            <Link
              key={comic.id}
              href={`/comics/${comic.slug}`}
              className="flex gap-4 border-b border-brand-surface p-4 last:border-b-0 transition-colors duration-150 hover:bg-brand-cardHover"
            >
              <Image src={comic.coverImage} alt="" width={72} height={96} className="aspect-[3/4] rounded-md object-cover" />
              <span className="min-w-0 py-1">
                <span className="block truncate font-semibold text-white">{comic.title}</span>
                <span className="mt-2 block text-sm text-brand-textSecondary">
                  Latest Chapter {comic.chapters[0]?.number ?? 1}
                </span>
                <span className="mt-1 line-clamp-2 text-sm text-brand-textMuted">{comic.synopsis}</span>
              </span>
            </Link>
          ))
        ) : (
          <p className="p-8 text-center text-brand-textSecondary">
            {query ? "No results found." : "Start typing to search the library."}
          </p>
        )}
      </Card>
    </div>
  );
}
