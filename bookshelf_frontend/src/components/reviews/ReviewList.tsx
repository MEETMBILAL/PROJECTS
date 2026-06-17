"use client";

import { useQuery } from "@tanstack/react-query";

import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { queryKeys } from "@/constants/queryKeys";
import { reviewsApi } from "@/lib/api/reviews";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";

export function ReviewList({ slug }: { slug: string }) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.reviews(slug),
    queryFn: () => reviewsApi.list(slug),
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        {isLoading ? (
          <LoadingSpinner />
        ) : data && data.length > 0 ? (
          <div>
            {data.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No reviews yet"
            description="Be the first to review this book."
          />
        )}
      </div>
      <ReviewForm slug={slug} />
    </div>
  );
}
