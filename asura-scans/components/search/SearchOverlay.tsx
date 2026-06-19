"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { useSearchStore } from "@/stores";
import { Input } from "@/components/ui/input";
import { formatRelativeTime } from "@/lib/utils";

interface SearchResult {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  latestChapter?: {
    number: number;
    publishedAt: string;
  };
}

export function SearchOverlay() {
  const { isOpen, query, close, setQuery } = useSearchStore();
  const [results, setResults] = useState<SearchResult[]>([]);
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
      setResults(data.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, isOpen, search]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/80 backdrop-blur-sm pt-[10vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search comics"
    >
      <div className="w-full max-w-2xl px-4">
        <div className="overflow-hidden rounded-modal border border-brand-surface bg-brand-card shadow-2xl">
          <div className="flex items-center gap-3 border-b border-brand-surface px-4">
            <Search className="h-5 w-5 shrink-0 text-brand-muted" />
            <Input
              autoFocus
              placeholder="Search manga, manhwa, manhua..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 bg-transparent text-lg text-brand-text-primary focus-visible:ring-0"
              aria-label="Search query"
            />
            <button
              onClick={close}
              className="rounded-md p-2 text-brand-muted hover:text-brand-text-primary"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
            {loading && (
              <p className="p-6 text-center text-brand-text-secondary">Searching...</p>
            )}

            {!loading && query && results.length === 0 && (
              <p className="p-6 text-center text-brand-text-secondary">
                No results found for &ldquo;{query}&rdquo;
              </p>
            )}

            {!loading && results.length > 0 && (
              <ul role="listbox" aria-label="Search results">
                {results.map((comic) => (
                  <li key={comic.id}>
                    <Link
                      href={`/comics/${comic.slug}`}
                      onClick={close}
                      className="flex items-center gap-4 px-4 py-3 transition-colors duration-150 hover:bg-brand-card-hover"
                      role="option"
                    >
                      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-cover">
                        <Image
                          src={comic.coverImage}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-brand-text-primary">
                          {comic.title}
                        </p>
                        {comic.latestChapter && (
                          <p className="text-xs text-brand-text-secondary">
                            Ch. {comic.latestChapter.number} ·{" "}
                            {formatRelativeTime(comic.latestChapter.publishedAt)}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {!loading && !query && (
              <p className="p-6 text-center text-brand-muted">
                Start typing to search...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
