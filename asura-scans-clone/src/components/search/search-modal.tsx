"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Loader2, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useUIStore } from "@/store/ui-store";
import { chapterLabel } from "@/lib/utils";
import type { ComicCardData } from "@/types";

export function SearchModal() {
  const { searchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<ComicCardData[]>([]);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  // debounced search (300ms)
  React.useEffect(() => {
    if (!searchOpen) return;
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          setResults(data.items ?? []);
        }
      } catch {
        /* aborted or network error */
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, [query, searchOpen]);

  React.useEffect(() => {
    if (searchOpen) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      closeSearch();
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <Dialog open={searchOpen} onOpenChange={(o) => !o && closeSearch()}>
      <DialogContent
        hideClose
        className="top-24 w-[95vw] max-w-2xl translate-y-0 gap-0 p-0"
      >
        <DialogTitle className="sr-only">Search comics</DialogTitle>
        <form onSubmit={onSubmit} className="flex items-center gap-2 border-b border-brand-surface px-4">
          <Search className="h-5 w-5 shrink-0 text-brand-text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search manga, manhwa, manhua…"
            className="h-14 w-full bg-transparent text-base text-white placeholder:text-brand-text-muted focus:outline-none"
            aria-label="Search query"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-brand-text-muted" />}
          <button
            type="button"
            onClick={closeSearch}
            aria-label="Close search"
            className="rounded p-1 text-brand-text-muted hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </form>

        <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin">
          {query.trim().length >= 2 && !loading && results.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-brand-text-secondary">
              No results found for &ldquo;{query}&rdquo;
            </p>
          )}
          {query.trim().length < 2 && (
            <p className="px-3 py-8 text-center text-sm text-brand-text-muted">
              Type at least 2 characters to search.
            </p>
          )}
          <ul>
            {results.map((comic) => (
              <li key={comic.id}>
                <Link
                  href={`/comics/${comic.slug}`}
                  onClick={closeSearch}
                  className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-brand-card-hover"
                >
                  <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded">
                    <Image
                      src={comic.coverImage}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {comic.title}
                    </p>
                    <p className="text-xs text-brand-text-secondary">
                      {comic.latestChapters[0]
                        ? chapterLabel(comic.latestChapters[0].number)
                        : "No chapters yet"}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
