"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";

import { searchComics } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function SearchOverlay({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => searchComics(debounced), [debounced]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-20 max-w-3xl translate-y-0 border-brand-surface bg-brand-card p-0 text-white shadow-purple-soft sm:rounded-xl">
        <DialogTitle className="sr-only">Search comics</DialogTitle>
        <div className="flex items-center gap-3 border-b border-brand-surface p-4">
          <Search className="h-5 w-5 text-brand-light" />
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search manga, manhwa, genres..."
            className="border-none bg-transparent text-base text-white placeholder:text-brand-muted focus-visible:ring-0"
            aria-label="Search query"
          />
          <Button variant="ghost" size="icon" aria-label="Close search" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-4">
          {!debounced ? (
            <p className="py-10 text-center text-sm text-brand-secondary">Start typing to search instantly.</p>
          ) : results.length === 0 ? (
            <p className="py-10 text-center text-sm text-brand-secondary">No results found for {debounced}.</p>
          ) : (
            <div className="grid gap-3">
              {results.map((comic) => (
                <Link
                  key={comic.id}
                  href={`/comics/${comic.slug}`}
                  onClick={() => onOpenChange(false)}
                  className="flex gap-3 rounded-lg border border-transparent p-2 hover:border-brand-primary hover:bg-brand-hover"
                >
                  <Image src={comic.coverImage} alt={comic.title} width={58} height={78} className="aspect-[3/4] rounded-md object-cover" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{comic.title}</p>
                    <p className="mt-1 text-xs text-brand-secondary">Latest chapter {comic.chapters[0]?.number} - {formatRelativeTime(comic.updatedAt)}</p>
                    <p className="mt-2 text-xs text-brand-light">{comic.genres.map((genre) => genre.name).join(" / ")}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
