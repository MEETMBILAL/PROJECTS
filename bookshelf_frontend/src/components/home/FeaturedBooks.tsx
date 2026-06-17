"use client";

import { BookCarousel } from "@/components/books/BookGrid";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ROUTES } from "@/constants/routes";
import { useFeaturedBooks } from "@/hooks/useBooks";

export function FeaturedBooks() {
  const { data, isLoading } = useFeaturedBooks();

  return (
    <section className="container-bs py-14">
      <SectionHeader
        title="Editor's Picks"
        subtitle="Handpicked favourites from our team"
        href={`${ROUTES.books}?is_featured=true`}
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : data && data.length > 0 ? (
        <BookCarousel books={data} />
      ) : (
        <p className="text-text-secondary">No featured books yet.</p>
      )}
    </section>
  );
}
