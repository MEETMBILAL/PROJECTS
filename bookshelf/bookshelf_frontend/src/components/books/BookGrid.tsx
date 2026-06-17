import type { Book } from "@/types/book";
import { BookCard } from "./BookCard";

export function BookGrid({ books }: { books: Book[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

export function BookCardSkeleton() {
  return (
    <div className="card animate-pulse overflow-hidden">
      <div className="aspect-[2/3] bg-surface-alt" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 rounded bg-surface-alt" />
        <div className="h-3 w-1/2 rounded bg-surface-alt" />
        <div className="h-4 w-1/3 rounded bg-surface-alt" />
      </div>
    </div>
  );
}

export function BookGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}
