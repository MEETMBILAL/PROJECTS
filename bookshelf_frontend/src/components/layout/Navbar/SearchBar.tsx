"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  const { data, isFetching } = useSearch(debounced);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`${ROUTES.search}?q=${encodeURIComponent(query.trim())}`);
      setFocused(false);
    }
  };

  const showResults = focused && debounced.trim().length > 1;

  return (
    <div className="relative w-full max-w-xl">
      <form onSubmit={submit} className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search books, authors, ISBN…"
          className="input pl-10"
          aria-label="Search"
        />
      </form>

      {showResults && (
        <div className="absolute z-50 mt-2 max-h-96 w-full overflow-y-auto rounded-xl border border-bsborder bg-white p-2 shadow-card-hover">
          {isFetching && (
            <p className="px-3 py-2 text-sm text-text-muted">Searching…</p>
          )}
          {!isFetching && data && data.books.length === 0 && (
            <p className="px-3 py-2 text-sm text-text-muted">No results found.</p>
          )}
          {data?.books.slice(0, 6).map((book) => (
            <Link
              key={book.id}
              href={ROUTES.book(book.slug)}
              onClick={() => setFocused(false)}
              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-surface-alt"
            >
              <span className="line-clamp-1 text-sm text-text-primary">{book.title}</span>
              <span className="shrink-0 text-xs text-primary">
                {formatPrice(book.effective_price, book.currency)}
              </span>
            </Link>
          ))}
          {data && data.books.length > 0 && (
            <Link
              href={`${ROUTES.search}?q=${encodeURIComponent(debounced)}`}
              onClick={() => setFocused(false)}
              className="mt-1 block rounded-lg bg-accent px-3 py-2 text-center text-sm font-medium text-primary"
            >
              View all {data.total} results
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
