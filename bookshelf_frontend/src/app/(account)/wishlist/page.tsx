"use client";

import { Heart } from "lucide-react";

import { BookGrid } from "@/components/books/BookGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { ROUTES } from "@/constants/routes";
import { useWishlistStore } from "@/store/wishlistStore";

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);

  return (
    <div>
      <h1 className="text-3xl text-primary">My Wishlist</h1>
      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Save books you love to find them easily later."
            actionLabel="Browse Books"
            actionHref={ROUTES.books}
          />
        </div>
      ) : (
        <div className="mt-6">
          <BookGrid books={items} />
        </div>
      )}
    </div>
  );
}
