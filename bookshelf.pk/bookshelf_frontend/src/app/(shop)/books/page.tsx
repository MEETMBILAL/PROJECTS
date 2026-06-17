"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";

import { BookFilters, type BookFilterValues } from "@/components/books/BookFilters";
import { BookGrid } from "@/components/books/BookGrid";
import { BookList } from "@/components/books/BookList";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Pagination } from "@/components/common/Pagination";
import { SORT_OPTIONS } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import { useBooks } from "@/hooks/useBooks";
import type { BookQueryParams } from "@/lib/api/books";
import { cn } from "@/lib/utils";

function BooksPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const params = useMemo(() => {
    const entries = Object.fromEntries(searchParams.entries());
    return entries as Record<string, string>;
  }, [searchParams]);

  const page = parseInt(params.page ?? "1", 10);

  const queryParams: BookQueryParams = {
    page,
    category: params.category,
    min_price: params.min_price ? Number(params.min_price) : undefined,
    max_price: params.max_price ? Number(params.max_price) : undefined,
    language: params.language,
    format: params.format,
    in_stock: params.in_stock === "1" ? true : undefined,
    sort: params.sort ?? "newest",
  };

  const { data, isLoading } = useBooks(queryParams);

  const updateParams = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (value === undefined || value === "") next.delete(key);
      else next.set(key, value);
    });
    if (!("page" in patch)) next.set("page", "1");
    router.push(`${ROUTES.books}?${next.toString()}`);
  };

  const filterValues: BookFilterValues = {
    category: params.category,
    min_price: params.min_price,
    max_price: params.max_price,
    language: params.language,
    format: params.format,
    in_stock: params.in_stock === "1",
  };

  const onFilterChange = (next: BookFilterValues) => {
    updateParams({
      category: next.category,
      min_price: next.min_price,
      max_price: next.max_price,
      language: next.language,
      format: next.format,
      in_stock: next.in_stock ? "1" : undefined,
    });
  };

  const books = data?.results ?? [];

  return (
    <div className="container-bs py-8">
      <Breadcrumb
        items={[{ label: "Home", href: ROUTES.home }, { label: "Books" }]}
        className="mb-6"
      />

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className={cn("lg:block", showFilters ? "block" : "hidden")}>
          <div className="card p-5">
            <BookFilters
              values={filterValues}
              onChange={onFilterChange}
              onReset={() => router.push(ROUTES.books)}
            />
          </div>
        </div>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowFilters((value) => !value)}
                className="btn-outline px-3 py-2 lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
              <p className="text-sm text-ink-secondary">
                {data ? `${data.count} books found` : "Loading…"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={params.sort ?? "newest"}
                onChange={(event) => updateParams({ sort: event.target.value })}
                className="input-bs w-auto py-2"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="hidden items-center rounded-lg border border-border sm:flex">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={cn(
                    "p-2",
                    view === "grid" ? "text-primary" : "text-ink-muted",
                  )}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={cn(
                    "p-2",
                    view === "list" ? "text-primary" : "text-ink-muted",
                  )}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : books.length === 0 ? (
            <EmptyState
              title="No books found"
              description="Try adjusting your filters or search terms."
              actionLabel="Reset filters"
              actionHref={ROUTES.books}
            />
          ) : (
            <>
              {view === "grid" ? (
                <BookGrid books={books} />
              ) : (
                <BookList books={books} />
              )}
              <div className="mt-10">
                <Pagination
                  currentPage={data?.current_page ?? 1}
                  totalPages={data?.total_pages ?? 1}
                  onPageChange={(nextPage) =>
                    updateParams({ page: String(nextPage) })
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<LoadingSpinner className="py-20" />}>
      <BooksPageInner />
    </Suspense>
  );
}
