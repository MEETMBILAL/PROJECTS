import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BookDetailHero } from "@/components/books/BookDetail/BookDetailHero";
import { BookDetailTabs } from "@/components/books/BookDetail/BookDetailTabs";
import { RelatedBooks } from "@/components/books/BookDetail/RelatedBooks";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ROUTES } from "@/constants/routes";
import { serverApi } from "@/lib/api/server";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const book = await serverApi.book(params.slug);
  if (!book) return { title: "Book not found" };
  return {
    title: book.meta_title || book.title,
    description:
      book.meta_description || book.short_description || book.description.slice(0, 160),
    openGraph: {
      title: book.title,
      description: book.short_description || book.description.slice(0, 160),
      images: book.cover_image ? [{ url: book.cover_image }] : undefined,
      type: "website",
    },
  };
}

export default async function BookDetailPage({ params }: PageProps) {
  const book = await serverApi.book(params.slug);
  if (!book) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    isbn: book.isbn ?? undefined,
    author: book.authors.map((a) => ({ "@type": "Person", name: a.name })),
    publisher: book.publisher?.name,
    numberOfPages: book.pages ?? undefined,
    inLanguage: book.language,
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

  const categoryName =
    typeof book.category === "object" && book.category ? book.category.name : undefined;

  return (
    <div className="container-bs py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumb
        items={[
          { label: "Books", href: ROUTES.books },
          { label: book.title },
        ]}
      />
      {categoryName && (
        <p className="mt-2 text-sm text-text-muted">in {categoryName}</p>
      )}
      <div className="mt-6 flex flex-col gap-10">
        <BookDetailHero book={book} />
        <BookDetailTabs book={book} />
        <RelatedBooks slug={book.slug} />
      </div>
    </div>
  );
}
