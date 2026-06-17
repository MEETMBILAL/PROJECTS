"use client";

import { useQuery } from "@tanstack/react-query";

import { BookCard } from "@/components/books/BookCard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { SectionHeader } from "@/components/common/SectionHeader";
import { booksApi } from "@/lib/api/books";
import { queryKeys } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";

export function FeaturedBooks() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.featured(),
    queryFn: booksApi.featured,
  });

  const books = data?.results ?? [];

  return (
    <section className="bg-surface-alt py-16">
      <div className="container-bs">
        <SectionHeader
          title="Editor's Picks"
          subtitle="Hand-selected titles our team loves"
          viewAllHref={`${ROUTES.books}?featured=1`}
        />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
            {books.map((book) => (
              <div key={book.id} className="w-44 flex-shrink-0">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
