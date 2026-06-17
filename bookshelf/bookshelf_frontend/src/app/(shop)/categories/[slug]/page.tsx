"use client";

import { useQuery } from "@tanstack/react-query";
import { booksApi } from "@/lib/api/books";
import { useBooks } from "@/hooks/useBooks";
import { queryKeys } from "@/constants/queryKeys";
import { BookGrid, BookGridSkeleton } from "@/components/books/BookGrid";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { EmptyState } from "@/components/common/EmptyState";
import { ROUTES } from "@/constants/routes";

export default function CategoryDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: category } = useQuery({
    queryKey: queryKeys.category(params.slug),
    queryFn: () => booksApi.category(params.slug),
  });
  const { data, isLoading } = useBooks({ category: params.slug });

  return (
    <div className="container-page py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: ROUTES.categories },
          { label: category?.name ?? params.slug },
        ]}
      />
      <h1 className="mb-2 font-display text-3xl text-text-primary">
        {category?.name ?? "Category"}
      </h1>
      {category?.description ? (
        <p className="mb-6 max-w-2xl text-text-secondary">
          {category.description}
        </p>
      ) : null}

      {isLoading ? (
        <BookGridSkeleton />
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
  );
}
