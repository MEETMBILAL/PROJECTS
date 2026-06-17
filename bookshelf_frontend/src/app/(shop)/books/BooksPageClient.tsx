"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";

import { BookFilters } from "@/components/books/BookFilters";
import { BookGrid } from "@/components/books/BookGrid";
import { BookList } from "@/components/books/BookList";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Pagination } from "@/components/common/Pagination";
import { SORT_OPTIONS } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import { useBooks } from "@/hooks/useBooks";
import { cn } from "@/lib/utils";

export function BooksPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  const view = params.view ?? "grid";
  const page = Number(params.page ?? 1);

  const { data, isLoading, isError } = useBooks(params);

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value === null) next.delete(key);
      else next.set(key, value);
      router.push(`${pathname}?${next.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="container-bs py-8">
      <Breadcrumb items={[{ label: "Books" }]} />
      <h1 className="mt-4 font-display text-3xl font-bold text-text-primary">
        All Books
      </h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block">
          <BookFilters />
        </div>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-text-secondary">
              {data ? `${data.count} books found` : "Loading…"}
            </p>
            <div className="flex items-center gap-3">
              <select
                value={params.sort ?? "newest"}
                onChange={(e) => setParam("sort", e.target.value)}
                className="input w-auto py-2 text-sm"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="flex overflow-hidden rounded-lg border border-bsborder">
                <button
                  type="button"
                  onClick={() => setParam("view", "grid")}
                  className={cn(
                    "grid h-9 w-9 place-items-center",
                    view === "grid" ? "bg-primary text-surface" : "bg-white text-text-secondary",
                  )}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setParam("view", "list")}
                  className={cn(
                    "grid h-9 w-9 place-items-center",
                    view === "list" ? "bg-primary text-surface" : "bg-white text-text-secondary",
                  )}
                  aria-label="List view"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <EmptyState title="Failed to load books" description="Please try again later." />
          ) : data && data.results.length > 0 ? (
            <>
              {view === "list" ? (
                <BookList books={data.results} />
              ) : (
                <BookGrid books={data.results} />
              )}
              <div className="mt-10">
                <Pagination
                  currentPage={page}
                  totalPages={data.total_pages}
                  onPageChange={(p) => setParam("page", String(p))}
                />
              </div>
            </>
          ) : (
            <EmptyState
              title="No books found"
              description="Try adjusting your filters or search terms."
              actionLabel="Clear filters"
              actionHref={ROUTES.books}
            />
          )}
        </div>
      </div>
    </div>
  );
}
