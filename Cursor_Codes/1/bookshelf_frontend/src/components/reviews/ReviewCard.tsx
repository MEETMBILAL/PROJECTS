import { BadgeCheck } from "lucide-react";
import type { Review } from "@/lib/api/reviews";
import { StarRating } from "@/components/common/StarRating";
import { formatDate, getInitials } from "@/lib/utils";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-semibold text-surface">
            {getInitials(review.user_name)}
          </span>
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
              {review.user_name}
              {review.is_verified_purchase ? (
                <BadgeCheck className="h-4 w-4 text-success" />
              ) : null}
            </p>
            <p className="text-xs text-text-muted">
              {formatDate(review.created_at)}
            </p>
          </div>
        </div>
        <StarRating value={review.rating} />
      </div>
      {review.title ? (
        <p className="mt-3 font-medium text-text-primary">{review.title}</p>
      ) : null}
      <p className="mt-1 text-sm text-text-secondary">{review.comment}</p>
    </div>
  );
}
