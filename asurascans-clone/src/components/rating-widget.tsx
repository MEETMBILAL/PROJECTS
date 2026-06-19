"use client";

import * as React from "react";
import { useSession } from "next-auth/react";

import { StarRating } from "@/components/star-rating";
import { toast } from "@/components/ui/toaster";

export function RatingWidget({
  slug,
  avgRating,
  ratingCount,
}: {
  slug: string;
  avgRating: number;
  ratingCount: number;
}) {
  const { data: session } = useSession();
  const [rating, setRating] = React.useState(avgRating);
  const [count, setCount] = React.useState(ratingCount);
  const [myRating, setMyRating] = React.useState<number | null>(null);

  const submit = async (value: number) => {
    if (!session?.user) {
      toast.error("Sign in to rate this comic");
      return;
    }
    setMyRating(value);
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, value }),
      });
      const data = await res.json();
      if (res.ok) {
        if (typeof data.avgRating === "number") setRating(data.avgRating);
        if (typeof data.ratingCount === "number") setCount(data.ratingCount);
        toast.success(`You rated this ${value}/10`);
      } else {
        toast.error(data.error ?? "Failed to submit rating");
      }
    } catch {
      toast.error("Failed to submit rating");
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-extrabold text-white">
          {rating.toFixed(1)}
        </span>
        <span className="text-sm text-brand-text-muted">/ 10</span>
      </div>
      <StarRating value={myRating ?? rating} onRate={submit} size={18} />
      <span className="text-xs text-brand-text-muted">
        {count.toLocaleString()} votes
      </span>
    </div>
  );
}
