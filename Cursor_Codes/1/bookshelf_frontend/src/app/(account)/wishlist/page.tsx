"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import { BookGrid } from "@/components/books/BookGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { ROUTES } from "@/constants/routes";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-text-primary">
        My Wishlist
      </h1>
      {items.length === 0 ? (
        <EmptyState
          title="Your wishlist is empty"
          description="Tap the heart on any book to save it for later."
          actionLabel="Browse Books"
          actionHref={ROUTES.books}
          icon={<Heart className="h-12 w-12" />}
        />
      ) : (
        <BookGrid books={items} />
      )}
    </div>
  );
}
