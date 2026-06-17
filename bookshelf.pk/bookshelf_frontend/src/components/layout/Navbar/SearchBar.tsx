"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearch } from "@/hooks/useSearch";
import { formatPrice } from "@/lib/utils";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const debounced = useDebounce(query, 300);
  const { data } = useSearch(debounced);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      router.push(`${ROUTES.search}?q=${encodeURIComponent(query.trim())}`);
      setFocused(false);
    }
  };

  const showResults = focused && debounced.length > 1 && data;

  return (
    <div className="relative w-full max-w-xl">
      <form onSubmit={submit} className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search books, authors, ISBN…"
          className="w-full rounded-full border border-border bg-surface-alt py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:bg-white"
        />
      </form>

      {showResults && (
        <div className="absolute z-50 mt-2 max-h-96 w-full overflow-y-auto rounded-xl border border-border bg-white p-2 shadow-card">
          {data.books.length === 0 &&
          data.authors.length === 0 &&
          data.categories.length === 0 ? (
            <p className="px-3 py-4 text-sm text-ink-secondary">
              No results for “{debounced}”.
            </p>
          ) : (
            <>
              {data.books.slice(0, 5).map((book) => (
                <Link
                  key={book.id}
                  href={ROUTES.book(book.slug)}
                  className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-alt"
                >
                  <div className="relative h-12 w-9 flex-shrink-0 overflow-hidden rounded bg-surface-alt">
                    <Image
                      src={book.cover_image}
                      alt={book.title}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {book.title}
                    </p>
                    <p className="text-xs text-ink-secondary">
                      {formatPrice(book.effective_price, book.currency)}
                    </p>
                  </div>
                </Link>
              ))}
              {data.authors.slice(0, 3).map((author) => (
                <Link
                  key={`a-${author.id}`}
                  href={ROUTES.author(author.slug)}
                  className="block rounded-lg px-3 py-2 text-sm text-ink-secondary hover:bg-surface-alt"
                >
                  Author: <span className="font-medium text-ink">{author.name}</span>
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
