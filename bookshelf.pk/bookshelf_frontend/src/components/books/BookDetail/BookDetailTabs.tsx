"use client";

import { useState } from "react";

import { ReviewList } from "@/components/reviews/ReviewList";
import { cn } from "@/lib/utils";
import type { BookDetail } from "@/types/book";

type TabKey = "description" | "details" | "reviews";

export function BookDetailTabs({ book }: { book: BookDetail }) {
  const [tab, setTab] = useState<TabKey>("description");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "description", label: "Description" },
    { key: "details", label: "Details" },
    { key: "reviews", label: `Reviews (${book.review_count})` },
  ];

  return (
    <div className="mt-12">
      <div className="flex gap-1 border-b border-border">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={cn(
              "-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition",
              tab === item.key
                ? "border-primary text-primary"
                : "border-transparent text-ink-secondary hover:text-ink",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="py-6">
        {tab === "description" && (
          <p className="whitespace-pre-line leading-relaxed text-ink-secondary">
            {book.description}
          </p>
        )}

        {tab === "details" && (
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            <DetailRow label="ISBN" value={book.isbn ?? "—"} mono />
            <DetailRow label="SKU" value={book.sku} mono />
            <DetailRow label="Language" value={book.language} />
            <DetailRow
              label="Pages"
              value={book.pages ? String(book.pages) : "—"}
            />
            <DetailRow label="Format" value={book.format} />
            <DetailRow label="Edition" value={book.edition || "—"} />
            {book.publisher && (
              <DetailRow label="Publisher" value={book.publisher.name} />
            )}
            <DetailRow
              label="Published"
              value={book.publication_date ?? "—"}
            />
          </dl>
        )}

        {tab === "reviews" && <ReviewList slug={book.slug} />}
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
    <div className="flex justify-between border-b border-border py-2">
      <dt className="text-sm text-ink-secondary">{label}</dt>
      <dd
        className={cn(
          "text-sm font-medium text-ink",
          mono && "font-mono text-xs",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
