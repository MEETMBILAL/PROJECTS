"use client";

import { useRelatedBooks } from "@/hooks/useBooks";
import { BookCard } from "@/components/books/BookCard";
import { SectionHeader } from "@/components/common/SectionHeader";

export function RelatedBooks({ slug }: { slug: string }) {
  const { data: books } = useRelatedBooks(slug);

  if (!books || books.length === 0) return null;

  return (
    <section>
      <SectionHeader title="Customers Also Bought" />
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {books.map((book) => (
          <div key={book.id} className="w-44 shrink-0 sm:w-52">
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </section>
  );
}
