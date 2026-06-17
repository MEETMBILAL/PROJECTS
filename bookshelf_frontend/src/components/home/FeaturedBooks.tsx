"use client";

import { BookCard } from "@/components/books/BookCard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ROUTES } from "@/constants/routes";
import { useFeaturedBooks } from "@/hooks/useBooks";

export function FeaturedBooks() {
  const { data: books, isLoading } = useFeaturedBooks();

  return (
    <section className="container-bs py-14">
      <SectionHeader
        title="Editor's Pick"
        subtitle="Hand-selected titles our team loves"
        viewAllHref={`${ROUTES.books}?is_featured=true`}
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {books?.map((book) => (
            <div key={book.id} className="w-44 shrink-0 sm:w-52">
              <BookCard book={book} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
