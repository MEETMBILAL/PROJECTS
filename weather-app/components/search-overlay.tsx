"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Comic } from "@/lib/mock-data";

type SearchOverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SearchOverlay({ open, onOpenChange }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange, open]);

  useEffect(() => {
    if (!open || !debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    async function runSearch() {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as { results?: Comic[] };
        setResults(data.results ?? []);
      } finally {
        setLoading(false);
      }
    }

    runSearch();
    return () => controller.abort();
  }, [debouncedQuery, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Search comics">
      <div className="container-shell pt-20">
        <div className="mx-auto max-w-3xl rounded-xl border border-brand-surface bg-brand-card p-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-brand-textSecondary" aria-hidden="true" />
            <Input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search comics, genres, and chapters..."
              className="border-0 bg-transparent text-base"
              aria-label="Search comics"
            />
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} aria-label="Close search">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {loading && <p className="px-2 py-8 text-center text-sm text-brand-textSecondary">Searching...</p>}
            {!loading && query.trim() && results.length === 0 && (
              <p className="px-2 py-8 text-center text-sm text-brand-textSecondary">No comics found for &quot;{query}&quot;.</p>
            )}
            <div className="space-y-2">
              {results.map((comic) => (
                <Link
                  key={comic.id}
                  href={`/comics/${comic.slug}`}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 rounded-lg p-2 hover:bg-brand-cardHover"
                >
                  <Image src={comic.coverImage} alt="" width={56} height={74} className="cover-aspect rounded object-cover" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{comic.title}</p>
                    <p className="text-sm text-brand-textSecondary">Latest chapter {comic.chapters[0]?.number ?? 1}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function useDebouncedValue(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  const key = useMemo(() => value, [value]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(key), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, key]);

  return debounced;
}
