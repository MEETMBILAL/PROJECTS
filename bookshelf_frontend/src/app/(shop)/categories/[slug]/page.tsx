"use client";

import { BookGrid } from "@/components/books/BookGrid";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ROUTES } from "@/constants/routes";
import { useBooks } from "@/hooks/useBooks";

export default function CategoryDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const { data, isLoading } = useBooks({ category: slug });

  const title = slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return (
    <div className="container-bs py-8">
      <Breadcrumb
        items={[{ label: "Categories", href: ROUTES.categories }, { label: title }]}
      />
      <h1 className="mt-4 font-display text-3xl font-bold text-text-primary">{title}</h1>

      <div className="mt-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : data && data.results.length > 0 ? (
          <BookGrid books={data.results} />
        ) : (
          <EmptyState
            title="No books in this category yet"
            actionLabel="Browse all books"
            actionHref={ROUTES.books}
          />
        )}
      </div>
    </div>
  );
}
