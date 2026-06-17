"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { useSearch } from "@/hooks/useSearch";

const PLACEHOLDER = "/images/placeholder-book.svg";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const { data, isFetching } = useSearch(query);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`${ROUTES.search}?q=${encodeURIComponent(query.trim())}`);
      setFocused(false);
    }
  };

  const showResults = focused && query.trim().length > 1;

  return (
    <div className="relative w-full max-w-xl">
      <form onSubmit={submit} className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search books, authors, ISBN..."
          className="input-bs pl-10"
        />
      </form>

      {showResults && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-bsborder bg-white shadow-card-hover">
          {isFetching && (
            <p className="px-4 py-3 text-sm text-text-muted">Searching…</p>
          )}
          {!isFetching && data && data.books.length === 0 && data.authors.length === 0 && (
            <p className="px-4 py-3 text-sm text-text-muted">No results found.</p>
          )}
          {data?.books.slice(0, 5).map((book) => (
            <Link
              key={book.id}
              href={ROUTES.book(book.slug)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-surface-alt"
              onMouseDown={(e) => e.preventDefault()}
            >
              <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded bg-surface-alt">
                <Image
                  src={book.cover_image || PLACEHOLDER}
                  alt={book.title}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm text-text-primary">{book.title}</p>
                <p className="truncate text-xs text-text-muted">
                  {book.authors.map((a) => a.name).join(", ")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
