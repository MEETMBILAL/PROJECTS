"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Search as SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import type { Comic } from "@/lib/types";
import { formatCompact, timeAgo } from "@/lib/utils";

function SearchInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";

  const [query, setQuery] = React.useState(initialQ);
  const [results, setResults] = React.useState<Comic[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searched, setSearched] = React.useState(false);

  // Debounced instant search (300ms)
  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const id = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&limit=20`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.items ?? []);
          setSearched(true);
        }
      } catch {
        /* aborted */
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, [query]);

  // Keep URL in sync (shallow).
  React.useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query);
    window.history.replaceState(null, "", `/search?${params.toString()}`);
  }, [query]);

  return (
    <div className="container max-w-3xl space-y-6 py-6">
      <div>
        <h1 className="section-heading mb-3">Search</h1>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-text-muted" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search comics, manhwa, manga…"
            className="h-12 pl-10 text-base"
            aria-label="Search"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-brand-purple-light" />
          )}
        </div>
      </div>

      {!query.trim() && (
        <p className="py-16 text-center text-sm text-brand-text-muted">
          Type a title or author to search the library.
        </p>
      )}

      {query.trim() && searched && results.length === 0 && !loading && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-lg font-semibold text-white">No results found</p>
          <p className="text-sm text-brand-text-secondary">
            We couldn&apos;t find anything for “{query}”. Try a different term.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <ul className="divide-y divide-brand-border/60 overflow-hidden rounded-lg border border-brand-border bg-brand-card">
          {results.map((comic) => (
            <li key={comic.id}>
              <Link
                href={`/comics/${comic.slug}`}
                className="flex items-center gap-3 p-3 transition-colors hover:bg-brand-card-hover"
              >
                <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded">
                  <Image
                    src={comic.coverImage}
                    alt={comic.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">
                    {comic.title}
                  </p>
                  <p className="truncate text-sm text-brand-text-secondary">
                    {comic.author} · {comic.type}
                  </p>
                  <p className="mt-0.5 text-xs text-brand-text-muted">
                    Ch. {comic.chapters[0]?.number ?? 0} ·{" "}
                    {comic.chapters[0]
                      ? timeAgo(comic.chapters[0].publishedAt)
                      : "—"}{" "}
                    · {formatCompact(comic.totalViews)} views
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <React.Suspense fallback={<div className="container py-10" />}>
      <SearchInner />
    </React.Suspense>
  );
}
