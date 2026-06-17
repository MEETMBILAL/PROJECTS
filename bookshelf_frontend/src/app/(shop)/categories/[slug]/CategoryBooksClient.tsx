"use client";

import { useQueryState } from "nuqs";

import { BookGrid } from "@/components/books/BookGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Pagination } from "@/components/common/Pagination";
import { ROUTES } from "@/constants/routes";
import { useBooks } from "@/hooks/useBooks";

export function CategoryBooksClient({ slug }: { slug: string }) {
  const [page, setPage] = useQueryState("page", { defaultValue: "1" });
  const pageNumber = parseInt(page || "1", 10);
  const { data, isLoading } = useBooks({ category: slug, page: pageNumber });

  if (isLoading) return <LoadingSpinner />;
  if (!data || data.results.length === 0) {
    return (
      <EmptyState
        title="No books in this category yet"
        description="Browse our full catalogue instead."
        actionLabel="All books"
        actionHref={ROUTES.books}
      />
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-text-secondary">{data.count} books found</p>
      <BookGrid books={data.results} />
      <div className="mt-8">
        <Pagination
          currentPage={data.current_page}
          totalPages={data.total_pages}
          onPageChange={(p) => setPage(String(p))}
        />
      </div>
    </>
  );
}
