"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";

import { StarRating } from "@/components/common/StarRating";
import { ROUTES } from "@/constants/routes";
import { queryKeys } from "@/constants/queryKeys";
import { reviewsApi } from "@/lib/api/reviews";
import { ApiError } from "@/lib/api/client";

export function ReviewForm({ slug }: { slug: string }) {
  const { status } = useSession();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const mutation = useMutation({
    mutationFn: () => reviewsApi.create(slug, { rating, title, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews(slug) });
      queryClient.invalidateQueries({ queryKey: queryKeys.book(slug) });
      setRating(0);
      setTitle("");
      setComment("");
      toast.success("Thanks for your review!");
    },
    onError: (error: ApiError) => toast.error(error.message),
  });

  if (status !== "authenticated") {
    return (
      <div className="card p-6 text-center text-sm text-text-secondary">
        Please{" "}
        <Link href={ROUTES.login} className="font-medium text-primary hover:underline">
          sign in
        </Link>{" "}
        to write a review.
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) {
      toast.error("Please choose a rating");
      return;
    }
    mutation.mutate();
  };

  return (
    <form onSubmit={submit} className="card space-y-4 p-6">
      <h4 className="font-display text-lg font-semibold">Write a Review</h4>
      <div>
        <label className="label">Your Rating</label>
        <StarRating rating={rating} size={28} interactive onChange={setRating} />
      </div>
      <div>
        <label className="label">Title (optional)</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          placeholder="Sum up your review"
        />
      </div>
      <div>
        <label className="label">Review</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="input"
          placeholder="Share your thoughts about this book"
        />
      </div>
      <button type="submit" disabled={mutation.isPending} className="btn-primary">
        {mutation.isPending ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
