"use client";

import { useQuery } from "@tanstack/react-query";

import { ReviewCard } from "./ReviewCard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { queryKeys } from "@/constants/queryKeys";
import { reviewsApi } from "@/lib/api/reviews";

export function ReviewList({ slug }: { slug: string }) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.reviews(slug),
    queryFn: () => reviewsApi.list(slug),
  });

  if (isLoading) return <LoadingSpinner />;
  if (!data || data.length === 0) {
    return <p className="text-text-secondary">No reviews yet. Be the first to review!</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
