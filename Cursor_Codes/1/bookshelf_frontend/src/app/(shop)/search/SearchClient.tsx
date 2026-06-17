"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { useDebounce } from "@/hooks/useDebounce";
import { BookGrid } from "@/components/books/BookGrid";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { ROUTES } from "@/constants/routes";

export function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const debounced = useDebounce(query, 350);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debounced) params.set("q", debounced);
    router.replace(`${ROUTES.search}?${params.toString()}`);
  }, [debounced, router]);

  const { data, isLoading } = useSearch(debounced);

  return (
    <div className="container-page py-8">
      <h1 className="mb-4 font-display text-3xl text-text-primary">Search</h1>
      <div className="relative max-w-2xl">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books, authors, ISBN…"
          className="input py-3.5 pl-12 text-lg"
        />
      </div>

      <div className="mt-8">
        {debounced.length <= 1 ? (
          <p className="text-text-secondary">
            Start typing to search our catalogue.
          </p>
        ) : isLoading ? (
          <LoadingSpinner label="Searching…" />
        ) : data &&
          (data.books.length > 0 ||
            data.authors.length > 0 ||
            data.categories.length > 0) ? (
          <div className="space-y-10">
            {data.categories.length > 0 ? (
              <section>
                <h2 className="mb-3 font-display text-xl text-text-primary">
                  Categories
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.categories.map((c) => (
                    <Link
                      key={c.id}
                      href={ROUTES.category(c.slug)}
                      className="badge bg-accent text-primary hover:bg-primary hover:text-surface"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {data.authors.length > 0 ? (
              <section>
                <h2 className="mb-3 font-display text-xl text-text-primary">
                  Authors
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.authors.map((a) => (
                    <Link
                      key={a.id}
                      href={ROUTES.author(a.slug)}
                      className="badge bg-surface-alt text-text-secondary hover:bg-primary hover:text-surface"
                    >
                      {a.name}
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {data.books.length > 0 ? (
              <section>
                <h2 className="mb-4 font-display text-xl text-text-primary">
                  Books ({data.books.length})
                </h2>
                <BookGrid books={data.books} />
              </section>
            ) : null}
          </div>
        ) : (
          <EmptyState
            title={`No results for “${debounced}”`}
            description="Try a different keyword, or browse all books."
            actionLabel="Browse Books"
            actionHref={ROUTES.books}
            icon={<SearchIcon className="h-12 w-12" />}
          />
        )}
      </div>
    </div>
  );
}
