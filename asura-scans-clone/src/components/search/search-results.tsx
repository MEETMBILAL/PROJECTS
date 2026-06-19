"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ComicGrid, ComicGridSkeleton } from "@/components/comic/comic-grid";
import type { ComicCardData } from "@/lib/types";

export function SearchResults({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [query, setQuery] = React.useState(initialQuery);
  const [results, setResults] = React.useState<ComicCardData[]>([]);
  const [loading, setLoading] = React.useState(!!initialQuery);
  const [searched, setSearched] = React.useState(!!initialQuery);

  React.useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    const controller = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=36`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(data.items ?? []);
        // keep the URL in sync
        window.history.replaceState(null, "", `/search?q=${encodeURIComponent(q)}`);
      } catch {
        /* aborted */
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-text-muted" />
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the entire library…"
          className="h-12 pl-11 text-base"
          aria-label="Search"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-brand-text-muted" />
        )}
      </div>

      {loading ? (
        <ComicGridSkeleton count={12} />
      ) : searched && results.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-brand-surface py-20 text-center">
          <p className="text-lg font-semibold text-white">No results</p>
          <p className="text-sm text-brand-text-secondary">
            We couldn&apos;t find anything for &ldquo;{query}&rdquo;.
          </p>
        </div>
      ) : results.length > 0 ? (
        <>
          <p className="text-sm text-brand-text-muted">{results.length} results</p>
          <ComicGrid comics={results} />
        </>
      ) : (
        <p className="py-16 text-center text-sm text-brand-text-muted">
          Type above to search across {`titles, authors and more`}.
        </p>
      )}

      <noscript>
        <button onClick={() => router.refresh()} />
      </noscript>
    </div>
  );
}
