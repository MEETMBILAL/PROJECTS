"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { BookDetail } from "@/types/book";
import { ReviewList } from "@/components/reviews/ReviewList";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { formatDate } from "@/lib/utils";

type Tab = "description" | "details" | "reviews";

export function BookDetailTabs({ book }: { book: BookDetail }) {
  const [tab, setTab] = useState<Tab>("description");

  const tabs: { id: Tab; label: string }[] = [
    { id: "description", label: "Description" },
    { id: "details", label: "Details" },
    { id: "reviews", label: `Reviews (${book.rating_count})` },
  ];

  const details: { label: string; value: string }[] = [
    { label: "ISBN", value: book.isbn || "—" },
    { label: "Language", value: book.language },
    { label: "Pages", value: book.pages ? String(book.pages) : "—" },
    { label: "Format", value: book.format },
    { label: "Edition", value: book.edition || "—" },
    {
      label: "Published",
      value: book.publication_date
        ? formatDate(book.publication_date)
        : "—",
    },
    { label: "SKU", value: book.sku },
  ];

  return (
    <div className="mt-12">
      <div className="flex gap-1 border-b border-bordercolor">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-3 text-sm font-medium transition-colors",
              tab === t.id
                ? "border-b-2 border-primary text-primary"
                : "text-text-secondary hover:text-primary",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="py-6">
        {tab === "description" ? (
          <p className="max-w-3xl whitespace-pre-line leading-relaxed text-text-secondary">
            {book.description}
          </p>
        ) : null}

        {tab === "details" ? (
          <dl className="grid max-w-2xl gap-px overflow-hidden rounded-xl border border-bordercolor bg-bordercolor">
            {details.map((d) => (
              <div
                key={d.label}
                className="flex justify-between bg-white px-4 py-3"
              >
                <dt className="text-sm text-text-secondary">{d.label}</dt>
                <dd className="font-mono text-sm text-text-primary">
                  {d.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {tab === "reviews" ? (
          <div className="max-w-3xl space-y-8">
            <ReviewForm slug={book.slug} />
            <ReviewList slug={book.slug} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
