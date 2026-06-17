"use client";

import { useBook } from "@/hooks/useBooks";
import { BookDetailHero } from "@/components/books/BookDetail/BookDetailHero";
import { BookDetailTabs } from "@/components/books/BookDetail/BookDetailTabs";
import { RelatedBooks } from "@/components/books/BookDetail/RelatedBooks";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { ROUTES } from "@/constants/routes";

export function BookDetailClient({ slug }: { slug: string }) {
  const { data: book, isLoading, isError } = useBook(slug);

  if (isLoading) return <LoadingSpinner label="Loading book…" />;
  if (isError || !book) {
    return (
      <div className="container-page py-12">
        <EmptyState
          title="Book not found"
          description="The book you're looking for doesn't exist or was removed."
          actionLabel="Browse books"
          actionHref={ROUTES.books}
        />
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Books", href: ROUTES.books },
          { label: book.title },
        ]}
      />
      <BookDetailHero book={book} />
      <BookDetailTabs book={book} />
      <RelatedBooks slug={slug} />
    </div>
  );
}
