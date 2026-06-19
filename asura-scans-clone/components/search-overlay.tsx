"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import type { Comic } from "@/types/comic";

type SearchOverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SearchOverlay({ open, onOpenChange }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange, open]);

  useEffect(() => {
    if (!open || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`, {
          signal: controller.signal
        });
        const data = (await response.json()) as { items: Comic[] };
        setResults(data.items);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [debouncedQuery, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true">
      <div className="mx-auto mt-20 max-w-3xl rounded-xl border border-brand-surface bg-brand-nav shadow-2xl">
        <div className="flex items-center gap-3 border-b border-brand-surface p-4">
          <Search className="h-5 w-5 text-brand-textSecondary" aria-hidden />
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search manga, manhwa, authors, genres..."
            aria-label="Search comics"
            className="border-0 bg-transparent text-base focus-visible:ring-0"
          />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-2 text-brand-textSecondary transition-colors duration-150 hover:bg-brand-cardHover hover:text-white"
            aria-label="Close search"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3">
          {loading ? (
            <p className="p-6 text-center text-sm text-brand-textSecondary">Searching...</p>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((comic) => (
                <Link
                  key={comic.id}
                  href={`/comics/${comic.slug}`}
                  onClick={() => onOpenChange(false)}
                  className="flex gap-3 rounded-lg p-2 transition-colors duration-150 hover:bg-brand-cardHover"
                >
                  <Image
                    src={comic.coverImage}
                    alt=""
                    width={56}
                    height={76}
                    className="aspect-[3/4] rounded-md object-cover"
                  />
                  <span className="min-w-0 py-1">
                    <span className="block truncate font-semibold text-white">{comic.title}</span>
                    <span className="text-sm text-brand-textSecondary">
                      Latest Chapter {comic.chapters[0]?.number ?? 1}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="p-6 text-center text-sm text-brand-textSecondary">
              {query.length < 2 ? "Type at least 2 characters to search." : "No comics found."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
