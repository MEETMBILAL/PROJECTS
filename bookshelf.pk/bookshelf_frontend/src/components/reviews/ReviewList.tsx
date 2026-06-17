"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { reviewsApi } from "@/lib/api/reviews";
import { queryKeys } from "@/constants/queryKeys";
import type { ReviewInput } from "@/lib/validations";

export function ReviewList({ slug }: { slug: string }) {
  const queryClient = useQueryClient();
  const { status } = useSession();

  const reviewsQuery = useQuery({
    queryKey: queryKeys.reviews(slug),
    queryFn: () => reviewsApi.list(slug),
  });

  const createMutation = useMutation({
    mutationFn: (values: ReviewInput) => reviewsApi.create(slug, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews(slug) });
      queryClient.invalidateQueries({ queryKey: queryKeys.book(slug) });
      toast.success("Thanks for your review!");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (reviewsQuery.isLoading) return <LoadingSpinner />;

  const reviews = reviewsQuery.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      {status === "authenticated" ? (
        <ReviewForm
          onSubmit={(values) => createMutation.mutate(values)}
          isSubmitting={createMutation.isPending}
        />
      ) : (
        <p className="rounded-xl border border-border bg-surface-alt p-4 text-sm text-ink-secondary">
          Please log in to write a review.
        </p>
      )}

      {reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description="Be the first to review this book."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
