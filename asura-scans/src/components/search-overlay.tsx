"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchStore } from "@/store";
import { SearchResult } from "@/lib/search";

export function SearchOverlay() {
  const { isOpen, query, close, setQuery } = useSearchStore();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm" role="dialog" aria-label="Search">
      <div className="container mx-auto px-4 pt-20 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-muted" />
          <Input
            autoFocus
            placeholder="Search comics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-14 pl-12 pr-12 text-lg rounded-modal"
            aria-label="Search comics"
          />
          <button
            onClick={close}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 bg-brand-card rounded-modal border border-brand-surface overflow-hidden max-h-[60vh] overflow-y-auto">
          {loading && (
            <p className="p-4 text-brand-text-secondary text-sm">Searching...</p>
          )}
          {!loading && query && results.length === 0 && (
            <p className="p-4 text-brand-text-secondary text-sm">
              No results found for &quot;{query}&quot;
            </p>
          )}
          {results.map((r) => (
            <Link
              key={r.id}
              href={`/comics/${r.slug}`}
              onClick={() => {
                close();
                router.push(`/comics/${r.slug}`);
              }}
              className="flex items-center gap-3 p-3 hover:bg-brand-card-hover transition-colors"
            >
              <div className="relative w-10 aspect-cover rounded overflow-hidden flex-shrink-0">
                <Image src={r.coverImage} alt="" fill className="object-cover" sizes="40px" />
              </div>
              <div>
                <p className="text-brand-text-primary text-sm font-medium">{r.title}</p>
                {r.latestChapter && (
                  <p className="text-xs text-brand-text-secondary">
                    Chapter {r.latestChapter}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
