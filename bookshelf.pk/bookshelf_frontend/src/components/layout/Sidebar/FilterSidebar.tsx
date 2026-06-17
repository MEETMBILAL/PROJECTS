"use client";

import {
  BookFilters,
  type BookFilterValues,
} from "@/components/books/BookFilters";

interface FilterSidebarProps {
  values: BookFilterValues;
  onChange: (next: BookFilterValues) => void;
  onReset: () => void;
}

export function FilterSidebar(props: FilterSidebarProps) {
  return (
    <div className="card p-5">
      <BookFilters {...props} />
    </div>
  );
}
