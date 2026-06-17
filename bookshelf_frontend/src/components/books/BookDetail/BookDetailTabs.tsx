"use client";

import { useState } from "react";

import { ReviewList } from "@/components/reviews/ReviewList";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { cn } from "@/lib/utils";
import type { BookDetail } from "@/types";

type TabKey = "description" | "details" | "reviews";

export function BookDetailTabs({ book }: { book: BookDetail }) {
  const [tab, setTab] = useState<TabKey>("description");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "description", label: "Description" },
    { key: "details", label: "Details" },
    { key: "reviews", label: `Reviews (${book.review_count})` },
  ];

  return (
    <div className="card-bs overflow-hidden">
      <div className="flex border-b border-bsborder">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "px-6 py-4 text-sm font-medium transition",
              tab === t.key
                ? "border-b-2 border-primary text-primary"
                : "text-text-secondary hover:text-primary",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {tab === "description" && (
          <p className="whitespace-pre-line leading-relaxed text-text-secondary">
            {book.description}
          </p>
        )}

        {tab === "details" && (
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailRow label="ISBN" value={book.isbn ?? "—"} mono />
            <DetailRow label="Pages" value={book.pages ? String(book.pages) : "—"} />
            <DetailRow label="Language" value={book.language} />
            <DetailRow label="Format" value={book.format} />
            <DetailRow label="Edition" value={book.edition || "—"} />
            <DetailRow label="Publisher" value={book.publisher?.name ?? "—"} />
            <DetailRow
              label="Publication date"
              value={book.publication_date ?? "—"}
            />
            <DetailRow label="SKU" value={book.sku} mono />
          </dl>
        )}

        {tab === "reviews" && (
          <div className="flex flex-col gap-6">
            <ReviewForm slug={book.slug} />
            <ReviewList slug={book.slug} />
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between border-b border-bsborder py-2">
      <dt className="text-text-muted">{label}</dt>
      <dd className={cn("text-text-primary", mono && "font-mono text-sm")}>{value}</dd>
    </div>
  );
}
