"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { reviewSchema, type ReviewInput } from "@/lib/validations";
import { reviewsApi } from "@/lib/api/reviews";
import { queryKeys } from "@/constants/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import { StarRating } from "@/components/common/StarRating";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";

export function ReviewForm({ slug }: { slug: string }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 },
  });

  const mutation = useMutation({
    mutationFn: (input: ReviewInput) => reviewsApi.create(slug, input),
    onSuccess: () => {
      toast.success("Thanks for your review!");
      reset();
      setRating(5);
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews(slug) });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (!isAuthenticated) {
    return (
      <div className="card p-5 text-sm text-text-secondary">
        Please{" "}
        <Link href={ROUTES.login} className="font-medium text-primary">
          log in
        </Link>{" "}
        to write a review.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate({ ...data, rating }))}
      className="card space-y-4 p-5"
    >
      <h3 className="font-display text-lg text-text-primary">
        Write a review
      </h3>
      <div>
        <label className="mb-1 block text-sm text-text-secondary">
          Your rating
        </label>
        <StarRating value={rating} size={24} onChange={setRating} />
      </div>
      <div>
        <input
          {...register("title")}
          placeholder="Review title (optional)"
          className="input"
        />
      </div>
      <div>
        <textarea
          {...register("comment")}
          placeholder="Share your thoughts about this book…"
          rows={4}
          className="input resize-none"
        />
        {errors.comment ? (
          <p className="mt-1 text-xs text-error">{errors.comment.message}</p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={mutation.isPending}
        className="btn-primary"
      >
        {mutation.isPending ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
