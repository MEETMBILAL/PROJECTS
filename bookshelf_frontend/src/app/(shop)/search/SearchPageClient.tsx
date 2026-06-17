"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { BookGrid } from "@/components/books/BookGrid";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ROUTES } from "@/constants/routes";
import { useSearch } from "@/hooks/useSearch";

export function SearchPageClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const { data, isLoading } = useSearch(query);

  return (
    <div className="container-bs py-8">
      <Breadcrumb items={[{ label: "Search" }]} />
      <h1 className="mt-4 font-display text-3xl font-bold text-text-primary">
        Search results for &ldquo;{query}&rdquo;
      </h1>

      {isLoading ? (
        <LoadingSpinner className="min-h-[40vh]" />
      ) : !data || data.total === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No results found"
            description="Try a different keyword or browse our full catalogue."
            actionLabel="Browse Books"
            actionHref={ROUTES.books}
          />
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {data.authors.length > 0 && (
            <section>
              <h2 className="mb-3 font-display text-xl font-semibold">Authors</h2>
              <div className="flex flex-wrap gap-2">
                {data.authors.map((author) => (
                  <Link
                    key={author.id}
                    href={ROUTES.author(author.slug)}
                    className="rounded-full border border-bsborder bg-white px-4 py-1.5 text-sm hover:border-primary"
                  >
                    {author.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {data.categories.length > 0 && (
            <section>
              <h2 className="mb-3 font-display text-xl font-semibold">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {data.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={ROUTES.category(category.slug)}
                    className="rounded-full border border-bsborder bg-white px-4 py-1.5 text-sm hover:border-primary"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-4 font-display text-xl font-semibold">
              Books ({data.total})
            </h2>
            <BookGrid books={data.books} />
          </section>
        </div>
      )}
    </div>
  );
}
