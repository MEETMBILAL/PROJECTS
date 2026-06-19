"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Loader2, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatChapterNumber } from "@/lib/utils";
import type { ComicCardData } from "@/lib/types";

export function SearchOverlay({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<ComicCardData[]>([]);
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      return;
    }
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [open]);

  React.useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(data.items ?? []);
      } catch {
        /* aborted */
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    onOpenChange(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="top-[8%] max-w-2xl p-0">
        <DialogTitle className="sr-only">Search comics</DialogTitle>
        <form onSubmit={submit} className="flex items-center gap-2 border-b border-brand-surface p-3">
          <Search className="h-5 w-5 shrink-0 text-brand-text-muted" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search manga, manhwa, manhua…"
            className="border-0 bg-transparent text-base focus-visible:ring-0"
            aria-label="Search"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-brand-text-muted" />}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-brand-text-muted hover:text-white"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </form>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() && !loading && results.length === 0 && (
            <p className="px-3 py-10 text-center text-sm text-brand-text-secondary">
              No results for &ldquo;{query}&rdquo;.
            </p>
          )}
          {!query.trim() && (
            <p className="px-3 py-10 text-center text-sm text-brand-text-muted">
              Start typing to search the library.
            </p>
          )}
          <ul className="space-y-1">
            {results.map((comic) => (
              <li key={comic.id}>
                <Link
                  href={`/comics/${comic.slug}`}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-brand-card-hover"
                >
                  <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded">
                    <Image src={comic.coverImage} alt="" fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{comic.title}</p>
                    {comic.chapters?.[0] && (
                      <p className="text-xs text-brand-text-secondary">
                        Latest: Ch. {formatChapterNumber(comic.chapters[0].number)}
                      </p>
                    )}
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
