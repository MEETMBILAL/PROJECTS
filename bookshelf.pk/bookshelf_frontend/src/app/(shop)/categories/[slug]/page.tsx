"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { BookGrid } from "@/components/books/BookGrid";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { booksApi } from "@/lib/api/books";
import { queryKeys } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";

export default function CategoryDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const categoryQuery = useQuery({
    queryKey: queryKeys.category(slug),
    queryFn: () => booksApi.category(slug),
  });

  const booksQuery = useQuery({
    queryKey: [...queryKeys.category(slug), "books"],
    queryFn: () => booksApi.categoryBooks(slug),
  });

  const category = categoryQuery.data;
  const books = booksQuery.data?.results ?? [];

  return (
    <div className="container-bs py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: ROUTES.home },
          { label: "Categories", href: ROUTES.categories },
          { label: category?.name ?? slug },
        ]}
        className="mb-6"
      />
      <h1 className="font-display text-4xl text-ink">
        {category?.name ?? "Category"}
      </h1>
      {category?.description && (
        <p className="mt-2 max-w-2xl text-ink-secondary">
          {category.description}
        </p>
      )}

      <div className="mt-8">
        {booksQuery.isLoading ? (
          <LoadingSpinner />
        ) : books.length === 0 ? (
          <EmptyState
            title="No books in this category yet"
            actionLabel="Browse all books"
            actionHref={ROUTES.books}
          />
        ) : (
          <BookGrid books={books} />
        )}
      </div>
    </div>
  );
}
