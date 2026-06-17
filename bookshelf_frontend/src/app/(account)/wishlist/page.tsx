"use client";

import { Heart } from "lucide-react";

import { BookGrid } from "@/components/books/BookGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ROUTES } from "@/constants/routes";
import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistPage() {
  const { data, isLoading } = useWishlist();

  if (isLoading) return <LoadingSpinner />;

  const books = data?.map((entry) => entry.book) ?? [];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-text-primary">My Wishlist</h1>
      <div className="mt-6">
        {books.length === 0 ? (
          <EmptyState
            title="Your wishlist is empty"
            description="Tap the heart on any book to save it for later."
            icon={<Heart size={48} strokeWidth={1.5} />}
            actionLabel="Browse Books"
            actionHref={ROUTES.books}
          />
        ) : (
          <BookGrid books={books} />
        )}
      </div>
    </div>
  );
}
