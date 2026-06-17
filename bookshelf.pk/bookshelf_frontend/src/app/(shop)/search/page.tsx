"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Search } from "lucide-react";

import { BookGrid } from "@/components/books/BookGrid";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ROUTES } from "@/constants/routes";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearch } from "@/hooks/useSearch";
import { getInitials } from "@/lib/utils";

function SearchPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const debounced = useDebounce(query, 300);
  const { data, isLoading } = useSearch(debounced);

  useEffect(() => {
    const next = new URLSearchParams();
    if (debounced) next.set("q", debounced);
    router.replace(`${ROUTES.search}?${next.toString()}`);
  }, [debounced, router]);

  return (
    <div className="container-bs py-8">
      <Breadcrumb
        items={[{ label: "Home", href: ROUTES.home }, { label: "Search" }]}
        className="mb-6"
      />

      <div className="relative mx-auto mb-10 max-w-2xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search books, authors, ISBN…"
          autoFocus
          className="w-full rounded-full border border-border bg-white py-3.5 pl-12 pr-4 text-base outline-none focus:border-primary"
        />
      </div>

      {debounced.length <= 1 ? (
        <EmptyState
          title="Start typing to search"
          description="Search across our entire catalogue of books and authors."
        />
      ) : isLoading ? (
        <LoadingSpinner />
      ) : !data ||
        (data.books.length === 0 &&
          data.authors.length === 0 &&
          data.categories.length === 0) ? (
        <EmptyState
          title={`No results for “${debounced}”`}
          description="Try a different keyword or browse our categories."
          actionLabel="Browse books"
          actionHref={ROUTES.books}
        />
      ) : (
        <div className="flex flex-col gap-10">
          {data.authors.length > 0 && (
            <section>
              <h2 className="mb-4 font-display text-2xl text-ink">Authors</h2>
              <div className="flex flex-wrap gap-3">
                {data.authors.map((author) => (
                  <Link
                    key={author.id}
                    href={ROUTES.author(author.slug)}
                    className="card flex items-center gap-3 p-3"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-primary">
                      {getInitials(author.name)}
                    </span>
                    <span className="font-medium text-ink">{author.name}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {data.categories.length > 0 && (
            <section>
              <h2 className="mb-4 font-display text-2xl text-ink">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {data.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={ROUTES.category(category.slug)}
                    className="rounded-full border border-border bg-white px-4 py-2 text-sm text-ink-secondary transition hover:border-primary hover:text-primary"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {data.books.length > 0 && (
            <section>
              <h2 className="mb-4 font-display text-2xl text-ink">
                Books ({data.books.length})
              </h2>
              <BookGrid books={data.books} />
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner className="py-20" />}>
      <SearchPageInner />
    </Suspense>
  );
}
