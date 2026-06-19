"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { RatingStars } from "./rating-stars";
import { toast } from "@/components/ui/toaster";
import { formatNumber } from "@/lib/utils";

interface RatingWidgetProps {
  comicId: string;
  avgRating: number;
  ratingCount: number;
}

export function RatingWidget({ comicId, avgRating, ratingCount }: RatingWidgetProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(avgRating);
  const [count, setCount] = useState(ratingCount);
  const [myRating, setMyRating] = useState<number | null>(null);

  const submit = async (value: number) => {
    if (!session?.user) {
      toast({ title: "Sign in to rate", description: "Log in to submit your rating.", variant: "error" });
      return;
    }
    setMyRating(value);
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comicId, value }),
      });
      const data = await res.json();
      if (data.avgRating != null) {
        setRating(data.avgRating);
        setCount(data.ratingCount);
      }
      toast({ title: "Rating submitted", description: `You rated ${value}/10`, variant: "success" });
    } catch {
      toast({ title: "Could not submit rating", variant: "error" });
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-extrabold text-white">{rating.toFixed(1)}</span>
        <span className="text-sm text-brand-text-muted">/ 10</span>
        <RatingStars value={myRating ?? rating} interactive size={18} onRate={submit} />
      </div>
      <p className="text-xs text-brand-text-muted">
        {formatNumber(count)} {count === 1 ? "vote" : "votes"}
        {myRating != null && <span className="text-brand-purple-light"> · You: {myRating}/10</span>}
      </p>
    </div>
  );
}
