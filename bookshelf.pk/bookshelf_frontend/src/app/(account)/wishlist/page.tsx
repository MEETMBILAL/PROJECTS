"use client";

import { Heart } from "lucide-react";

import { BookGrid } from "@/components/books/BookGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ROUTES } from "@/constants/routes";
import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistPage() {
  const { items, isLoading } = useWishlist();

  if (isLoading) return <LoadingSpinner />;

  const books = items.map((item) => item.book);

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-ink">My Wishlist</h1>
      {books.length === 0 ? (
        <EmptyState
          title="Your wishlist is empty"
          description="Save books you love to find them quickly later."
          icon={<Heart className="h-12 w-12" />}
          actionLabel="Browse Books"
          actionHref={ROUTES.books}
        />
      ) : (
        <BookGrid books={books} />
      )}
    </div>
  );
}
