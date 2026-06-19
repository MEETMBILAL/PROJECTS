"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search as SearchIcon, Loader2, SearchX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ComicCard, ComicCardSkeleton } from "@/components/comic/comic-card";
import type { ComicCardDTO } from "@/lib/types";

function SearchContent() {
  const params = useSearchParams();
  const router = useRouter();
  const initialQ = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<ComicCardDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Debounced (300ms) instant search + URL sync.
  useEffect(() => {
    const q = query.trim();
    const t = setTimeout(async () => {
      const url = new URL(window.location.href);
      if (q) url.searchParams.set("q", q);
      else url.searchParams.delete("q");
      router.replace(`${url.pathname}${url.search}`, { scroll: false });

      if (!q) {
        setResults([]);
        setSearched(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=30`);
        const data = await res.json();
        setResults(data.results ?? []);
        setSearched(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query, router]);

  return (
    <div className="container max-w-5xl py-8">
      <h1 className="mb-4 text-2xl font-extrabold text-white sm:text-3xl">Search</h1>

      <div className="relative mb-8">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-text-muted" />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-brand-purple-light" />
        )}
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search manhwa, manga, manhua..."
          aria-label="Search comics"
          className="h-12 pl-12 text-base"
        />
      </div>

      {loading && results.length === 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <ComicCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <SearchX className="h-12 w-12 text-brand-text-muted" />
          <p className="text-lg font-semibold text-white">
            No results for &ldquo;{query}&rdquo;
          </p>
          <p className="text-sm text-brand-text-secondary">
            Try a different keyword or check the spelling.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <>
          <p className="mb-4 text-sm text-brand-text-secondary">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {results.map((comic) => (
              <ComicCard key={comic.id} comic={comic} />
            ))}
          </div>
        </>
      )}

      {!searched && !loading && !query.trim() && (
        <p className="py-20 text-center text-sm text-brand-text-muted">
          Start typing to search the library.
        </p>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container py-8" />}>
      <SearchContent />
    </Suspense>
  );
}
