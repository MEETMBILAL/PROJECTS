"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Loader2, X, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { ComicCardDTO } from "@/lib/types";
import { formatCompact } from "@/lib/utils";

interface SearchOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchOverlay({ open, onOpenChange }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ComicCardDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  // Debounced (300ms) instant search.
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        });
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        /* aborted or failed */
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);

  const goToFullSearch = useCallback(() => {
    const q = query.trim();
    if (!q) return;
    onOpenChange(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }, [query, onOpenChange, router]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose
        className="top-[12%] max-w-2xl translate-y-0 gap-0 overflow-hidden p-0"
      >
        <DialogTitle className="sr-only">Search comics</DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            goToFullSearch();
          }}
          className="flex items-center gap-3 border-b border-brand-surface px-4"
        >
          <Search className="h-5 w-5 shrink-0 text-brand-text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search manhwa, manga, manhua..."
            aria-label="Search comics"
            className="h-14 w-full bg-transparent text-base text-white outline-none placeholder:text-brand-text-muted"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-brand-purple-light" />}
          <button
            type="button"
            aria-label="Close search"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-brand-text-muted transition-colors hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </form>

        <div className="max-h-[60vh] overflow-y-auto">
          {!query.trim() && (
            <div className="flex items-center gap-2 p-6 text-sm text-brand-text-muted">
              <TrendingUp className="h-4 w-4" />
              Start typing to search the library.
            </div>
          )}

          {query.trim() && !loading && results.length === 0 && (
            <div className="p-6 text-center text-sm text-brand-text-secondary">
              No results for <span className="text-white">&ldquo;{query}&rdquo;</span>
            </div>
          )}

          <ul className="divide-y divide-brand-surface/60">
            {results.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/comics/${c.slug}`}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 p-3 transition-colors hover:bg-brand-card-hover"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.coverImage}
                    alt=""
                    className="h-16 w-12 shrink-0 rounded-md object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{c.title}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-brand-text-secondary">
                      <Badge variant="gold" className="px-1.5 py-0">
                        ★ {c.avgRating.toFixed(1)}
                      </Badge>
                      {c.latestChapters[0] && (
                        <span>Ch. {c.latestChapters[0].number}</span>
                      )}
                      <span className="text-brand-text-muted">
                        {formatCompact(c.totalViews)} views
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {results.length > 0 && (
            <button
              onClick={goToFullSearch}
              className="w-full border-t border-brand-surface p-3 text-center text-sm font-medium text-brand-purple-light transition-colors hover:bg-brand-card-hover"
            >
              See all results for &ldquo;{query}&rdquo;
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
