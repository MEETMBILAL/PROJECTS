"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Star } from "lucide-react";

import { reviewSchema, type ReviewInput } from "@/lib/validations";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  onSubmit: (values: ReviewInput) => void;
  isSubmitting?: boolean;
}

export function ReviewForm({ onSubmit, isSubmitting }: ReviewFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, title: "", comment: "" },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => {
        onSubmit(values);
        reset();
      })}
      className="card flex flex-col gap-4 p-5"
    >
      <h4 className="font-display text-lg text-ink">Write a review</h4>

      <Controller
        control={control}
        name="rating"
        render={({ field }) => (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => field.onChange(index + 1)}
                aria-label={`${index + 1} stars`}
              >
                <Star
                  className={cn(
                    "h-6 w-6 transition",
                    index < field.value
                      ? "fill-secondary text-secondary"
                      : "text-border",
                  )}
                />
              </button>
            ))}
          </div>
        )}
      />

      <div>
        <input
          {...register("title")}
          placeholder="Review title (optional)"
          className="input-bs"
        />
      </div>

      <div>
        <textarea
          {...register("comment")}
          placeholder="Share your thoughts about this book…"
          rows={4}
          className="input-bs resize-none"
        />
        {errors.comment && (
          <p className="mt-1 text-xs text-error">{errors.comment.message}</p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary self-start">
        {isSubmitting ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
