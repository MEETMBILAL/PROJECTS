import { BookCard } from "./BookCard";
import type { BookListItem } from "@/types/book";

export function BookGrid({ books }: { books: BookListItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

export function BookCarousel({ books }: { books: BookListItem[] }) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
      {books.map((book) => (
        <div key={book.id} className="w-44 shrink-0 sm:w-52">
          <BookCard book={book} />
        </div>
      ))}
    </div>
  );
}
