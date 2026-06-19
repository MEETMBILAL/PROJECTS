"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/comics/status-badge";
import { chapterLabel, formatCompact } from "@/lib/utils";
import type { ComicCardData } from "@/types";

export function SearchResults({
  initialQuery,
  initialResults,
}: {
  initialQuery: string;
  initialResults: ComicCardData[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = React.useState(initialQuery);
  const [results, setResults] = React.useState(initialResults);
  const [loading, setLoading] = React.useState(false);
  const firstRender = React.useRef(true);

  // debounced live search (300ms) + URL sync
  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const q = query.trim();
    const id = setTimeout(async () => {
      const url = q ? `/search?q=${encodeURIComponent(q)}` : "/search";
      window.history.replaceState(null, "", url);
      if (q.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=30`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.items ?? []);
        }
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [query]);

  return (
    <div>
      <div className="relative mb-8 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-text-muted" />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-brand-text-muted" />
        )}
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or author…"
          className="h-12 pl-10 text-base"
          autoFocus
          aria-label="Search"
        />
      </div>

      {query.trim().length >= 2 && !loading && results.length === 0 && (
        <div className="rounded-lg border border-dashed border-brand-surface py-20 text-center">
          <p className="text-lg font-semibold text-white">
            No results for &ldquo;{query}&rdquo;
          </p>
          <p className="mt-1 text-sm text-brand-text-secondary">
            Try a different keyword or check the spelling.
          </p>
        </div>
      )}

      {query.trim().length < 2 && (
        <p className="text-sm text-brand-text-muted">
          Type at least 2 characters to search the catalog.
        </p>
      )}

      <ul className="grid gap-3">
        {results.map((comic) => (
          <li key={comic.id}>
            <Link
              href={`/comics/${comic.slug}`}
              className="flex items-center gap-4 rounded-lg border border-brand-surface bg-brand-card p-3 transition-colors hover:bg-brand-card-hover"
            >
              <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded">
                <Image
                  src={comic.coverImage}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold text-white">{comic.title}</p>
                  <StatusBadge status={comic.status} />
                </div>
                <p className="mt-1 text-sm text-brand-text-secondary">
                  {comic.latestChapters[0]
                    ? chapterLabel(comic.latestChapters[0].number)
                    : "No chapters yet"}
                </p>
                <p className="mt-0.5 text-xs text-brand-text-muted">
                  {formatCompact(comic.totalViews)} views · ★ {comic.avgRating.toFixed(1)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
