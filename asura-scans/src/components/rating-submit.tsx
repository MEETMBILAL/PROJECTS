"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { StarRating } from "./star-rating";

export function RatingSubmit({ comicId }: { comicId: string }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleRate = async (score: number) => {
    if (!session) {
      window.location.href = "/auth/signin";
      return;
    }
    setRating(score);
    const res = await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comicId, score }),
    });
    if (res.ok) setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="text-sm text-brand-badge-new mb-4">
        Thanks for rating! You rated {rating?.toFixed(1)}/10
      </p>
    );
  }

  return (
    <div className="mb-4">
      <p className="text-xs text-brand-text-secondary mb-1">Rate this comic</p>
      <StarRating
        rating={rating ?? 0}
        interactive
        showValue={false}
        size="md"
        onRate={handleRate}
      />
    </div>
  );
}
