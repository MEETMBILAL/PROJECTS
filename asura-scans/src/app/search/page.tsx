"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { ComicCardData } from "@/types";

function SearchResults() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ComicCardData[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.data ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    if (initialQuery) search(initialQuery);
  }, [initialQuery, search]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="section-heading text-2xl mb-6">Search</h1>

      <div className="relative max-w-xl mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-muted" />
        <Input
          placeholder="Search manga, manhwa, manhua..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12"
          aria-label="Search query"
        />
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-brand-secondary text-lg">
            No results found for &quot;{query}&quot;
          </p>
          <p className="text-brand-muted text-sm mt-2">
            Try a different search term or browse our catalog
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((comic) => (
            <Link
              key={comic.id}
              href={`/comics/${comic.slug}`}
              className="flex items-center gap-4 p-4 rounded-cover border border-brand-surface bg-brand-card hover:bg-brand-card-hover transition-colors"
            >
              <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-cover">
                <Image
                  src={comic.coverImage}
                  alt={comic.title}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div>
                <p className="font-medium">{comic.title}</p>
                {comic.latestChapter && (
                  <p className="text-sm text-brand-secondary">
                    Chapter {comic.latestChapter}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
