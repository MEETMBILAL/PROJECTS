"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

import { queryKeys } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { reviewsApi } from "@/lib/api/reviews";
import { reviewSchema, type ReviewInput } from "@/lib/validations";
import { cn } from "@/lib/utils";

export function ReviewForm({ slug }: { slug: string }) {
  const { status } = useSession();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 },
  });

  const mutation = useMutation({
    mutationFn: (input: ReviewInput) => reviewsApi.create(slug, input),
    onSuccess: () => {
      toast.success("Thank you for your review!");
      reset({ rating: 5, title: "", comment: "" });
      setRating(5);
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews(slug) });
    },
    onError: () => toast.error("Could not submit review. Have you already reviewed this book?"),
  });

  if (status !== "authenticated") {
    return (
      <div className="rounded-xl border border-bsborder bg-surface-alt p-4 text-sm text-text-secondary">
        Please{" "}
        <Link href={ROUTES.login} className="text-secondary underline">
          sign in
        </Link>{" "}
        to write a review.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate({ ...data, rating }))}
      className="flex flex-col gap-3 rounded-xl border border-bsborder p-4"
    >
      <p className="font-medium text-text-primary">Write a review</p>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => {
              setRating(star);
              setValue("rating", star);
            }}
            aria-label={`${star} stars`}
          >
            <Star
              size={24}
              className={cn(
                star <= rating ? "fill-secondary text-secondary" : "text-bsborder",
              )}
            />
          </button>
        ))}
      </div>
      <input
        type="text"
        placeholder="Review title (optional)"
        className="input-bs"
        {...register("title")}
      />
      <textarea
        placeholder="Share your thoughts about this book..."
        rows={3}
        className="input-bs"
        {...register("comment")}
      />
      {errors.comment && <p className="text-sm text-error">{errors.comment.message}</p>}
      <button type="submit" disabled={mutation.isPending} className="btn-primary self-start">
        {mutation.isPending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
