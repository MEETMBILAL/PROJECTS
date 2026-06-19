"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { RatingStars } from "@/components/comics/rating-stars";
import { formatCompact } from "@/lib/utils";

export function RatingWidget({
  comicId,
  initialAvg,
  initialCount,
}: {
  comicId: string;
  initialAvg: number;
  initialCount: number;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [avg, setAvg] = React.useState(initialAvg);
  const [count, setCount] = React.useState(initialCount);
  const [submitting, setSubmitting] = React.useState(false);

  async function handleRate(value10: number) {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comicId, value: Math.round(value10) }),
      });
      if (res.ok) {
        const data = await res.json();
        setAvg(data.avgRating);
        setCount(data.ratingCount);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <RatingStars value={avg} interactive size={22} onRate={handleRate} />
      <div className="text-sm">
        <span className="font-bold text-white">{avg.toFixed(1)}</span>
        <span className="text-brand-text-muted"> / 10</span>
        <span className="ml-2 text-brand-text-secondary">
          ({formatCompact(count)} votes)
        </span>
      </div>
    </div>
  );
}
