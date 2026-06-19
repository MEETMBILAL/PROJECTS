"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { useSearchStore } from "@/stores/search-store";
import { Input } from "@/components/ui/input";
import type { ComicListItem } from "@/lib/types";

export function SearchOverlay() {
  const { isOpen, query, close, setQuery } = useSearchStore();
  const router = useRouter();
  const [results, setResults] = useState<ComicListItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, close]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm animate-fade-in" role="dialog" aria-label="Search comics">
      <div className="container mx-auto px-4 pt-20">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-text-muted" />
          <Input
            autoFocus
            placeholder="Search manga, manhwa, manhua..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-14 pl-12 pr-12 text-lg bg-brand-card border-brand-surface"
            aria-label="Search query"
          />
          <button
            onClick={close}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-white"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-w-2xl mx-auto mt-4 bg-brand-card rounded-lg border border-brand-surface overflow-hidden max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-brand-purple" />
            </div>
          )}
          {!loading && query && results.length === 0 && (
            <p className="p-8 text-center text-brand-text-muted">No results found for &quot;{query}&quot;</p>
          )}
          {results.map((comic) => (
            <button
              key={comic.id}
              onClick={() => {
                close();
                router.push(`/comics/${comic.slug}`);
              }}
              className="flex items-center gap-3 w-full p-3 hover:bg-brand-card-hover transition-colors text-left"
            >
              <Image
                src={comic.coverImage}
                alt={comic.title}
                width={48}
                height={64}
                className="rounded-md aspect-[3/4] object-cover"
              />
              <div>
                <p className="font-medium text-white">{comic.title}</p>
                {comic.latestChapter && (
                  <p className="text-sm text-brand-text-secondary">
                    Chapter {comic.latestChapter.number}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SearchButton() {
  const open = useSearchStore((s) => s.open);

  return (
    <button
      onClick={open}
      className="p-2 rounded-lg text-brand-text-secondary hover:text-white hover:bg-brand-card-hover transition-colors"
      aria-label="Open search"
    >
      <Search className="h-5 w-5" />
    </button>
  );
}
