"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, SlidersHorizontal } from "lucide-react";
import { useBooks } from "@/hooks/useBooks";
import { BookGrid, BookGridSkeleton } from "@/components/books/BookGrid";
import { BookFilters, type FilterValues } from "@/components/books/BookFilters";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { SORT_OPTIONS } from "@/constants/config";
import { ROUTES } from "@/constants/routes";

export function BooksClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters: FilterValues = useMemo(
    () => ({
      category: searchParams.get("category") ?? "",
      min_price: searchParams.get("min_price") ?? "",
      max_price: searchParams.get("max_price") ?? "",
      language: searchParams.get("language") ?? "",
      format: searchParams.get("format") ?? "",
      in_stock: searchParams.get("in_stock") === "true",
    }),
    [searchParams],
  );

  const sort = searchParams.get("sort") ?? "newest";
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  const setParams = useCallback(
    (patch: Record<string, string | boolean | number>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([key, value]) => {
        if (value === "" || value === false) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      if (!("page" in patch)) params.set("page", "1");
      router.push(`${ROUTES.books}?${params.toString()}`);
    },
    [router, searchParams],
  );

  const { data, isLoading } = useBooks({
    page,
    sort,
    category: filters.category || undefined,
    min_price: filters.min_price ? Number(filters.min_price) : undefined,
    max_price: filters.max_price ? Number(filters.max_price) : undefined,
    language: filters.language || undefined,
    format: filters.format || undefined,
    in_stock: filters.in_stock || undefined,
    featured: searchParams.get("featured") === "true" || undefined,
    bestseller: searchParams.get("bestseller") === "true" || undefined,
    new_arrival: searchParams.get("new_arrival") === "true" || undefined,
  });

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Books" }]} />

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-text-primary">All Books</h1>
          {data ? (
            <p className="mt-1 text-sm text-text-secondary">
              {data.count} {data.count === 1 ? "book" : "books"} found
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-text-secondary sm:inline">
            Sort by
          </span>
          <select
            value={sort}
            onChange={(e) => setParams({ sort: e.target.value })}
            className="input w-auto py-2"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block">
          <BookFilters
            values={filters}
            onChange={(patch) => setParams(patch)}
            onReset={() => router.push(ROUTES.books)}
          />
        </div>

        <div>
          <details className="mb-4 lg:hidden">
            <summary className="btn-outline inline-flex cursor-pointer">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </summary>
            <div className="mt-4 card p-4">
              <BookFilters
                values={filters}
                onChange={(patch) => setParams(patch)}
                onReset={() => router.push(ROUTES.books)}
              />
            </div>
          </details>

          {isLoading ? (
            <BookGridSkeleton />
          ) : data && data.results.length > 0 ? (
            <>
              <BookGrid books={data.results} />
              <Pagination
                currentPage={data.current_page}
                totalPages={data.total_pages}
                onPageChange={(p) => setParams({ page: p })}
              />
            </>
          ) : (
            <EmptyState
              title="No books found"
              description="Try adjusting your filters or search for something else."
              actionLabel="Clear filters"
              actionHref={ROUTES.books}
              icon={<LayoutGrid className="h-12 w-12" />}
            />
          )}
        </div>
      </div>
    </div>
  );
}
