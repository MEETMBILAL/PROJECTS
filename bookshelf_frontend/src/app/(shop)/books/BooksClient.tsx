"use client";

import { useQueryState } from "nuqs";
import { LayoutGrid, List } from "lucide-react";

import { BookFilters, type BookFilterValues } from "@/components/books/BookFilters";
import { BookGrid } from "@/components/books/BookGrid";
import { BookList } from "@/components/books/BookList";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Pagination } from "@/components/common/Pagination";
import { ROUTES } from "@/constants/routes";
import { useBooks } from "@/hooks/useBooks";
import { cn } from "@/lib/utils";
import { useState } from "react";

const SORT_OPTIONS = [
  { value: "-created_at", label: "Newest" },
  { value: "original_price", label: "Price: Low to High" },
  { value: "-original_price", label: "Price: High to Low" },
  { value: "-sale_count", label: "Best Selling" },
];

export function BooksClient() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useQueryState("page", { defaultValue: "1" });
  const [search] = useQueryState("search", { defaultValue: "" });
  const [category, setCategory] = useQueryState("category", { defaultValue: "" });
  const [ordering, setOrdering] = useQueryState("sort", { defaultValue: "-created_at" });
  const [minPrice, setMinPrice] = useQueryState("min_price", { defaultValue: "" });
  const [maxPrice, setMaxPrice] = useQueryState("max_price", { defaultValue: "" });
  const [language, setLanguage] = useQueryState("language", { defaultValue: "" });
  const [format, setFormat] = useQueryState("format", { defaultValue: "" });
  const [inStock, setInStock] = useQueryState("in_stock", { defaultValue: "" });
  const [minRating, setMinRating] = useQueryState("min_rating", { defaultValue: "" });

  const pageNumber = parseInt(page || "1", 10);

  const { data, isLoading, isError } = useBooks({
    page: pageNumber,
    search: search || undefined,
    category: category || undefined,
    ordering: ordering || undefined,
    min_price: minPrice ? Number(minPrice) : undefined,
    max_price: maxPrice ? Number(maxPrice) : undefined,
    language: language || undefined,
    format: format || undefined,
    in_stock: inStock === "true" ? true : undefined,
    min_rating: minRating ? Number(minRating) : undefined,
  });

  const filterValues: BookFilterValues = {
    category: category || "",
    min_price: minPrice || "",
    max_price: maxPrice || "",
    language: language || "",
    format: format || "",
    in_stock: inStock === "true",
    min_rating: minRating || "",
  };

  const onFilterChange = (partial: Partial<BookFilterValues>) => {
    setPage("1");
    if ("category" in partial) setCategory(partial.category || null);
    if ("min_price" in partial) setMinPrice(partial.min_price || null);
    if ("max_price" in partial) setMaxPrice(partial.max_price || null);
    if ("language" in partial) setLanguage(partial.language || null);
    if ("format" in partial) setFormat(partial.format || null);
    if ("in_stock" in partial) setInStock(partial.in_stock ? "true" : null);
    if ("min_rating" in partial) setMinRating(partial.min_rating || null);
  };

  const onReset = () => {
    setCategory(null);
    setMinPrice(null);
    setMaxPrice(null);
    setLanguage(null);
    setFormat(null);
    setInStock(null);
    setMinRating(null);
    setPage("1");
  };

  return (
    <div className="container-bs py-8">
      <Breadcrumb items={[{ label: "Books", href: ROUTES.books }]} />
      <h1 className="mt-3 text-4xl text-primary">All Books</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block">
          <BookFilters values={filterValues} onChange={onFilterChange} onReset={onReset} />
        </div>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-text-secondary">
              {data ? `${data.count} books found` : "Loading…"}
            </p>
            <div className="flex items-center gap-2">
              <select
                value={ordering ?? "-created_at"}
                onChange={(e) => setOrdering(e.target.value)}
                className="input-bs w-auto py-2 text-sm"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="flex rounded-xl border border-bsborder">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={cn(
                    "p-2",
                    view === "grid" ? "text-primary" : "text-text-muted",
                  )}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={cn(
                    "p-2",
                    view === "list" ? "text-primary" : "text-text-muted",
                  )}
                  aria-label="List view"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <EmptyState title="Could not load books" description="Please try again later." />
          ) : data && data.results.length > 0 ? (
            <>
              {view === "grid" ? (
                <BookGrid books={data.results} />
              ) : (
                <BookList books={data.results} />
              )}
              <div className="mt-8">
                <Pagination
                  currentPage={data.current_page}
                  totalPages={data.total_pages}
                  onPageChange={(p) => setPage(String(p))}
                />
              </div>
            </>
          ) : (
            <EmptyState
              title="No books found"
              description="Try adjusting your filters or search terms."
              actionLabel="Reset filters"
              actionHref={ROUTES.books}
            />
          )}
        </div>
      </div>
    </div>
  );
}
