"use client";

import { useRelatedBooks } from "@/hooks/useBooks";
import { SectionHeader } from "@/components/common/SectionHeader";
import { BookCarousel } from "@/components/books/BookCarousel";

export function RelatedBooks({ slug }: { slug: string }) {
  const { data } = useRelatedBooks(slug);

  if (!data || data.length === 0) return null;

  return (
    <section className="mt-16">
      <SectionHeader title="Customers Also Bought" />
      <BookCarousel books={data} />
    </section>
  );
}
