"use client";

import { useQueryState } from "nuqs";
import Link from "next/link";
import { User } from "lucide-react";

import { BookGrid } from "@/components/books/BookGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ROUTES } from "@/constants/routes";
import { useSearch } from "@/hooks/useSearch";

export function SearchClient() {
  const [query, setQuery] = useQueryState("q", { defaultValue: "" });
  const { data, isFetching } = useSearch(query || "");

  return (
    <div className="container-bs py-8">
      <h1 className="text-4xl text-primary">Search</h1>
      <input
        value={query ?? ""}
        onChange={(e) => setQuery(e.target.value || null)}
        placeholder="Search books, authors, categories..."
        className="input-bs mt-4 max-w-xl"
      />

      {!query || query.trim().length < 2 ? (
        <p className="mt-8 text-text-secondary">Type at least 2 characters to search.</p>
      ) : isFetching ? (
        <LoadingSpinner />
      ) : data &&
        (data.books.length > 0 || data.authors.length > 0 || data.categories.length > 0) ? (
        <div className="mt-8 flex flex-col gap-10">
          {data.categories.length > 0 && (
            <section>
              <h2 className="mb-3 text-2xl text-primary">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {data.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={ROUTES.category(cat.slug)}
                    className="rounded-full border border-bsborder px-4 py-2 text-sm hover:border-primary"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {data.authors.length > 0 && (
            <section>
              <h2 className="mb-3 text-2xl text-primary">Authors</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.authors.map((author) => (
                  <Link
                    key={author.id}
                    href={ROUTES.author(author.slug)}
                    className="card-bs flex items-center gap-3 p-4 hover:border-primary"
                  >
                    <User size={20} className="text-primary" />
                    <span className="text-text-primary">{author.name}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {data.books.length > 0 && (
            <section>
              <h2 className="mb-3 text-2xl text-primary">Books</h2>
              <BookGrid books={data.books} />
            </section>
          )}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            title={`No results for "${query}"`}
            description="Try different keywords or browse our full catalogue."
            actionLabel="Browse books"
            actionHref={ROUTES.books}
          />
        </div>
      )}
    </div>
  );
}
