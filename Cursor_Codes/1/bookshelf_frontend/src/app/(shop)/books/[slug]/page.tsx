import type { Metadata } from "next";
import { booksApi } from "@/lib/api/books";
import { BookDetailClient } from "./BookDetailClient";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const book = await booksApi.detail(params.slug);
    return {
      title: book.meta_title || book.title,
      description:
        book.meta_description ||
        book.short_description ||
        book.description.slice(0, 160),
      openGraph: {
        title: book.title,
        description: book.short_description || book.description.slice(0, 160),
        images: [{ url: book.cover_image }],
        type: "website",
      },
    };
  } catch {
    return { title: "Book" };
  }
}

export default async function BookDetailPage({ params }: PageProps) {
  let jsonLd: Record<string, unknown> | null = null;
  try {
    const book = await booksApi.detail(params.slug);
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Book",
      name: book.title,
      isbn: book.isbn ?? undefined,
      author: book.authors.map((a) => ({
        "@type": "Person",
        name: a.name,
      })),
      image: book.cover_image,
      description: book.short_description || book.description.slice(0, 200),
      offers: {
        "@type": "Offer",
        price: book.effective_price,
        priceCurrency: book.currency,
        availability: book.in_stock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      },
    };
  } catch {
    jsonLd = null;
  }

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <BookDetailClient slug={params.slug} />
    </>
  );
}
