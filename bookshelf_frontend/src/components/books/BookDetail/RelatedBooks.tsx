"use client";

import { BookCarousel } from "@/components/books/BookGrid";
import { SectionHeader } from "@/components/common/SectionHeader";
import { useRelatedBooks } from "@/hooks/useBooks";

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
