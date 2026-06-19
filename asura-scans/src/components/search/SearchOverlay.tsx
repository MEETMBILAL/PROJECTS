"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchStore } from "@/store";
import { ComicCardData } from "@/types";

export function SearchOverlay() {
  const router = useRouter();
  const { isOpen, query, closeSearch, setQuery } = useSearchStore();
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
    if (!isOpen) return;
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, isOpen, search]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    if (isOpen) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeSearch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm" role="dialog" aria-label="Search comics">
      <div className="container mx-auto px-4 pt-20">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-muted" />
          <Input
            autoFocus
            placeholder="Search manga, manhwa, manhua..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 h-12 text-base"
            aria-label="Search query"
          />
          <button
            onClick={closeSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-w-2xl mx-auto mt-4 max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-brand-purple" />
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <p className="text-center text-brand-secondary py-8">
              No results found for &quot;{query}&quot;
            </p>
          )}

          {!loading && results.length > 0 && (
            <ul className="space-y-2">
              {results.map((comic) => (
                <li key={comic.id}>
                  <Link
                    href={`/comics/${comic.slug}`}
                    onClick={closeSearch}
                    className="flex items-center gap-3 rounded-lg bg-brand-card border border-brand-surface p-3 hover:bg-brand-card-hover transition-colors"
                  >
                    <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-cover">
                      <Image
                        src={comic.coverImage}
                        alt={comic.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-brand-text">{comic.title}</p>
                      {comic.latestChapter && (
                        <p className="text-xs text-brand-secondary">
                          Chapter {comic.latestChapter}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!loading && query && results.length > 0 && (
            <button
              onClick={() => {
                router.push(`/search?q=${encodeURIComponent(query)}`);
                closeSearch();
              }}
              className="w-full mt-4 py-2 text-sm text-brand-purple hover:text-brand-purple-light"
            >
              View all results →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
