"use client";

import { useParams } from "next/navigation";

import { BookDetailHero } from "@/components/books/BookDetail/BookDetailHero";
import { BookDetailTabs } from "@/components/books/BookDetail/BookDetailTabs";
import { RelatedBooks } from "@/components/books/BookDetail/RelatedBooks";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ROUTES } from "@/constants/routes";
import { useBook } from "@/hooks/useBooks";

export default function BookDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { data: book, isLoading, isError } = useBook(slug);

  if (isLoading) return <LoadingSpinner className="py-32" />;

  if (isError || !book) {
    return (
      <div className="container-bs py-20">
        <EmptyState
          title="Book not found"
          description="The book you're looking for doesn't exist or is unavailable."
          actionLabel="Browse books"
          actionHref={ROUTES.books}
        />
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    isbn: book.isbn ?? undefined,
    author: book.authors.map((author) => ({
      "@type": "Person",
      name: author.name,
    })),
    image: book.cover_image,
    description: book.short_description || book.description,
    offers: {
      "@type": "Offer",
      price: book.effective_price,
      priceCurrency: book.currency,
      availability: book.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating:
      book.review_count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: book.average_rating,
            reviewCount: book.review_count,
          }
        : undefined,
  };

  return (
    <div className="container-bs py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumb
        items={[
          { label: "Home", href: ROUTES.home },
          { label: "Books", href: ROUTES.books },
          ...(book.category
            ? [
                {
                  label: book.category.name,
                  href: ROUTES.category(book.category.slug),
                },
              ]
            : []),
          { label: book.title },
        ]}
        className="mb-6"
      />
      <BookDetailHero book={book} />
      <BookDetailTabs book={book} />
      <RelatedBooks slug={slug} />
    </div>
  );
}
