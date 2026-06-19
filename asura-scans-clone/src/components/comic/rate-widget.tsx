"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { RatingStars } from "@/components/comic/rating-stars";

export function RateWidget({
  comicId,
  avgRating,
  ratingCount,
  userRating,
}: {
  comicId: string;
  avgRating: number;
  ratingCount: number;
  userRating?: number | null;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [localValue, setLocalValue] = React.useState(userRating ?? null);

  async function submit(value: number) {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }
    setSubmitting(true);
    setLocalValue(value);
    try {
      await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comicId, value }),
      });
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <RatingStars value={avgRating} size={18} />
        <span className="text-sm font-semibold text-white">{avgRating.toFixed(1)}</span>
        <span className="text-xs text-brand-text-muted">/ 10 · {ratingCount} votes</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-brand-text-muted">Your rating:</span>
        <RatingStars
          value={localValue ?? 0}
          size={16}
          interactive={!submitting}
          onRate={submit}
        />
      </div>
    </div>
  );
}
