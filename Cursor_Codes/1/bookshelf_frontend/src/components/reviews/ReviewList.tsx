"use client";

import { useQuery } from "@tanstack/react-query";
import { reviewsApi, type Review } from "@/lib/api/reviews";
import { queryKeys } from "@/constants/queryKeys";
import { ReviewCard } from "./ReviewCard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

function normalize(data: Review[] | { results: Review[] } | undefined): Review[] {
  if (!data) return [];
  return Array.isArray(data) ? data : data.results;
}

export function ReviewList({ slug }: { slug: string }) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.reviews(slug),
    queryFn: () => reviewsApi.list(slug),
  });

  const reviews = normalize(data);

  if (isLoading) return <LoadingSpinner />;
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-text-secondary">
        No reviews yet. Be the first to review this book!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
