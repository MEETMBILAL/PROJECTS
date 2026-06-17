import { format } from "date-fns";
import { BadgeCheck } from "lucide-react";

import { StarRating } from "@/components/common/StarRating";
import { getInitials } from "@/lib/utils";
import type { Review } from "@/lib/api/reviews";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="card p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-primary">
          {getInitials(review.user_name)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-ink">{review.user_name}</span>
            {review.is_verified_purchase && (
              <span className="inline-flex items-center gap-1 text-xs text-success">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <StarRating rating={review.rating} size={14} />
            <span className="text-xs text-ink-muted">
              {format(new Date(review.created_at), "dd MMM yyyy")}
            </span>
          </div>
          {review.title && (
            <p className="mt-2 font-medium text-ink">{review.title}</p>
          )}
          {review.comment && (
            <p className="mt-1 text-sm text-ink-secondary">{review.comment}</p>
          )}
        </div>
      </div>
    </div>
  );
}
