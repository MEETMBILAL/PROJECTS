"use client";

import { SectionHeader } from "@/components/common/SectionHeader";
import { BookCard } from "@/components/books/BookCard";
import { useRelatedBooks } from "@/hooks/useBooks";

export function RelatedBooks({ slug }: { slug: string }) {
  const { data: books } = useRelatedBooks(slug);

  if (!books || books.length === 0) return null;

  return (
    <section className="mt-16">
      <SectionHeader title="Customers Also Bought" />
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
        {books.map((book) => (
          <div key={book.id} className="w-44 flex-shrink-0">
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </section>
  );
}
