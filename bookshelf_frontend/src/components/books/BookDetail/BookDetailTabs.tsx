"use client";

import { useState } from "react";

import { ReviewList } from "@/components/reviews/ReviewList";
import { cn, formatDate } from "@/lib/utils";
import type { Book } from "@/types/book";

const TABS = ["Description", "Details", "Reviews"] as const;
type Tab = (typeof TABS)[number];

export function BookDetailTabs({ book }: { book: Book }) {
  const [tab, setTab] = useState<Tab>("Description");

  const details: { label: string; value: string }[] = [
    { label: "ISBN", value: book.isbn ?? "—" },
    { label: "Publisher", value: book.publisher?.name ?? "—" },
    { label: "Language", value: book.language },
    { label: "Pages", value: book.pages ? String(book.pages) : "—" },
    { label: "Format", value: book.format },
    { label: "Edition", value: book.edition || "—" },
    {
      label: "Publication Date",
      value: book.publication_date ? formatDate(book.publication_date) : "—",
    },
    { label: "SKU", value: book.sku },
  ];

  return (
    <div className="mt-14">
      <div className="flex gap-6 border-b border-bsborder">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "-mb-px border-b-2 px-1 pb-3 text-sm font-medium transition-colors",
              tab === item
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary",
            )}
          >
            {item}
            {item === "Reviews" && book.review_count > 0 && ` (${book.review_count})`}
          </button>
        ))}
      </div>

      <div className="py-8">
        {tab === "Description" && (
          <div className="prose max-w-none whitespace-pre-line text-text-secondary">
            {book.description}
          </div>
        )}
        {tab === "Details" && (
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {details.map((detail) => (
              <div
                key={detail.label}
                className="flex justify-between border-b border-bsborder py-2 text-sm"
              >
                <dt className="text-text-secondary">{detail.label}</dt>
                <dd className="font-medium text-text-primary">{detail.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {tab === "Reviews" && <ReviewList slug={book.slug} />}
      </div>
    </div>
  );
}
