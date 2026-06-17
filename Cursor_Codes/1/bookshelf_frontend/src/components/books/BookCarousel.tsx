import type { Book } from "@/types/book";
import { BookCard } from "./BookCard";

export function BookCarousel({ books }: { books: Book[] }) {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
      {books.map((book) => (
        <div
          key={book.id}
          className="w-40 shrink-0 snap-start sm:w-48 md:w-52"
        >
          <BookCard book={book} />
        </div>
      ))}
    </div>
  );
}
