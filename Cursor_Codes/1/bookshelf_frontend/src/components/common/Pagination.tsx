"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) =>
      p === 1 ||
      p === totalPages ||
      (p >= currentPage - 1 && p <= currentPage + 1),
  );

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5">
      <button
        type="button"
        className="btn-ghost h-9 w-9 rounded-lg p-0 disabled:opacity-40"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((page, i) => {
        const prev = pages[i - 1];
        const gap = prev && page - prev > 1;
        return (
          <span key={page} className="flex items-center gap-1.5">
            {gap ? <span className="px-1 text-text-muted">…</span> : null}
            <button
              type="button"
              onClick={() => onPageChange(page)}
              className={cn(
                "h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition-colors",
                page === currentPage
                  ? "bg-primary text-surface"
                  : "text-text-secondary hover:bg-surface-alt",
              )}
            >
              {page}
            </button>
          </span>
        );
      })}
      <button
        type="button"
        className="btn-ghost h-9 w-9 rounded-lg p-0 disabled:opacity-40"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
