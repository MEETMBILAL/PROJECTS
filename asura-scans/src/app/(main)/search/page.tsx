"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { ComicListItem } from "@/lib/types";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><div className="h-12 bg-brand-card rounded-lg animate-pulse" /></div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ComicListItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.data ?? []);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="section-heading text-2xl mb-6">Search</h1>
      <div className="relative max-w-xl mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-text-muted" />
        <Input
          placeholder="Search manga, manhwa, manhua..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12"
          aria-label="Search comics"
        />
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-brand-text-muted">No results found for &quot;{query}&quot;</p>
        </div>
      )}

      <div className="space-y-2">
        {results.map((comic) => (
          <Link
            key={comic.id}
            href={`/comics/${comic.slug}`}
            className="flex items-center gap-4 p-3 rounded-lg bg-brand-card border border-brand-surface hover:bg-brand-card-hover transition-colors group"
          >
            <Image
              src={comic.coverImage}
              alt={comic.title}
              width={56}
              height={75}
              className="rounded-md aspect-[3/4] object-cover"
            />
            <div>
              <h3 className="font-semibold text-white group-hover:text-brand-purple-light transition-colors">
                {comic.title}
              </h3>
              {comic.latestChapter && (
                <p className="text-sm text-brand-text-secondary">
                  Chapter {comic.latestChapter.number}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
