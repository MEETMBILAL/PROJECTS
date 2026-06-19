"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Search as SearchIcon, X } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Comic } from "@/lib/types";
import { formatCompact } from "@/lib/utils";

export function SearchModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Comic[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Debounced instant search (300ms)
  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const id = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.items ?? []);
        }
      } catch {
        /* aborted or failed */
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, [query]);

  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose
        className="top-[12%] w-[95vw] max-w-2xl translate-y-0 gap-0 p-0"
      >
        <form onSubmit={submit} className="flex items-center gap-2 border-b border-brand-border px-4 py-3">
          <SearchIcon className="h-5 w-5 text-brand-text-muted" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search comics, manhwa, manga…"
            className="h-9 border-0 bg-transparent px-0 text-base focus-visible:ring-0"
            aria-label="Search"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-brand-purple-light" />}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close search"
            className="rounded-sm p-1 text-brand-text-secondary hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </form>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() && !loading && results.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-brand-text-secondary">
              No results for “{query}”.
            </p>
          )}
          {!query.trim() && (
            <p className="px-3 py-8 text-center text-sm text-brand-text-muted">
              Start typing to search the library.
            </p>
          )}
          <ul className="flex flex-col">
            {results.map((comic) => (
              <li key={comic.id}>
                <Link
                  href={`/comics/${comic.slug}`}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-brand-card-hover"
                >
                  <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded">
                    <Image
                      src={comic.coverImage}
                      alt={comic.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {comic.title}
                    </p>
                    <p className="truncate text-xs text-brand-text-secondary">
                      Ch. {comic.chapters[0]?.number ?? 0} ·{" "}
                      {formatCompact(comic.totalViews)} views
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
