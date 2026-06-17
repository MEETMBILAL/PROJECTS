import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BookDetailHero } from "@/components/books/BookDetail/BookDetailHero";
import { BookDetailTabs } from "@/components/books/BookDetail/BookDetailTabs";
import { RelatedBooks } from "@/components/books/BookDetail/RelatedBooks";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/config";
import { getBookServer } from "@/lib/api/server";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = await getBookServer(params.slug);
  if (!book) return { title: "Book not found" };
  return {
    title: book.meta_title || book.title,
    description: book.meta_description || book.short_description || book.description.slice(0, 160),
    openGraph: {
      title: book.title,
      description: book.short_description,
      images: [{ url: book.cover_image }],
      type: "article",
    },
  };
}

export default async function BookDetailPage({ params }: Props) {
  const book = await getBookServer(params.slug);
  if (!book) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    image: book.cover_image,
    description: book.short_description || book.description,
    isbn: book.isbn ?? undefined,
    author: book.authors.map((a) => ({ "@type": "Person", name: a.name })),
    publisher: book.publisher?.name,
    aggregateRating:
      book.review_count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: book.average_rating,
            reviewCount: book.review_count,
          }
        : undefined,
    offers: {
      "@type": "Offer",
      price: book.effective_price,
      priceCurrency: book.currency,
      availability: book.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE.url}${ROUTES.book(book.slug)}`,
    },
  };

  return (
    <div className="container-bs py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumb
        items={[
          { label: "Books", href: ROUTES.books },
          ...(book.category_detail
            ? [{ label: book.category_detail.name, href: ROUTES.category(book.category_detail.slug) }]
            : []),
          { label: book.title },
        ]}
      />
      <div className="mt-6">
        <BookDetailHero book={book} />
        <BookDetailTabs book={book} />
        <RelatedBooks slug={book.slug} />
      </div>
    </div>
  );
}
